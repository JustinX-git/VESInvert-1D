const distances =  resistGraph.measuredDataPoints.distances;
const resistivities =  resistGraph.measuredDataPoints.resistivities;


// Evaluating RRMSE(Relative Root Mean Square Error)
const evalRRMSE = (observedXs,observedYs, modelResponseVect) =>{
  let errorSquareSum = 0;
  observedXs.forEach((observedX, index) =>{
      errorSquareSum +=   Math.pow((observedYs[index] - Math.exp(modelResponseVect[index][0]))/observedYs[index], 2);
      // errorSquareSum += Math.pow(observedYs[index] - modelResponseVect[index][0], 2);
  });
  const RMSE = Math.sqrt(errorSquareSum/observedXs.length);
  return RMSE * 100;
}

//Sample model parameter for a six layer subsurface.
const initialModel = [
      { "resistivity": 400, "thickness": 0.5, "depth": 0.5 },
    { "resistivity": 300, "thickness": 2,"depth": 2.5 },
    { "resistivity": 180, "thickness": 6.5, "depth": 9 },
    { "resistivity": 100, "thickness": 5, "depth": 14 },
    { "resistivity": 3000, "thickness": 76, "depth": 90 },
    { "resistivity": 3000, "thickness": "Infinity", "depth": 75 }
];
const modelParamsNo = initialModel.length


//Field data transformation and analysis
const logResistivities = resistivities.map(resistivity => Math.log(resistivity));
const resistivitiesNo = resistivities.length;


//Function to calculate the resistivity transform for the uppermost layer
const evalTransform = (parameters,u,subjacentLayerTransform,layerNo)=>{
  if(layerNo === 1) return subjacentLayerTransform
  else{
    //Using Pekeris recursive relation
    const layer = parameters[layerNo - 2];
    const angle =  layer.thickness/u;

    const transformNumerator = subjacentLayerTransform  + (layer.resistivity * Math.tanh(angle));
    const transformDenominator = 1 + ((subjacentLayerTransform  * Math.tanh(angle))/layer.resistivity);
    const layerTransform = transformNumerator/transformDenominator;
    

     return evalTransform(parameters,u,layerTransform, layerNo - 1);
  }
  
};

//Function to carry out deconvolution. Implemented here is the Nyman and Landistman 13 point filter.
const deconvolver = (distance, model) =>{
  const inverseFilterCoeffs = [0.0105, -0.0262, 0.0416, -0.0746, 0.1605,-0.4390, 1.3396, -2.7841, 1.6448, 0.8183, 0.2525, 0.336, 0.0225]
  const samplingInterval = Math.log(10)/4.438, f = 10;
  const e = Math.exp(0.5 * samplingInterval);
  const transformArray = [];
  let u = distance * Math.exp(-f * samplingInterval), convolutionSum = 0;

  for (let i = 0; i < 27; ++i){
    const topmostTransform = evalTransform(model, u, model[model.length - 1].resistivity, model.length);
    transformArray.push(topmostTransform);
    u = u * e;
  };


// Temporary convolution sum calculation. Need to fit into a for loop.
let i = 0;
convolutionSum = 105*transformArray[i] - 262*transformArray[i+2] + 416*transformArray[i+4] - 746*transformArray[i+6] + 1605*transformArray[i+8];
convolutionSum = convolutionSum - 4390*transformArray[i+10] + 13396*transformArray[i+12] - 27841*transformArray[i+14];
convolutionSum = convolutionSum + 16448*transformArray[i+16] + 8183*transformArray[i+18] + 2525*transformArray[i+20];
convolutionSum = (convolutionSum + 336*transformArray[i+22] + 225*transformArray[i+24]) / 10000;

  return convolutionSum;
}


// FORWARD MODEL OPERATOR
const forwardModelOperator = (model)=>{  
  const modelRoaVect = distances.map(distance => [deconvolver(distance, model)]); 
  return modelRoaVect.map(rho => [Math.log(rho[0])]);
}


//LOG DOMAIN LEVENBERG-MARQUARDT INVERSION SCHEME 

const ITERATION_LIMIT = 200;
const maxError = 1e-5;
const paramUpperBound = Math.log(1e+5);

let initialLogModel = initialModel.map(layer => ({
    logResistivity: Math.log(layer.resistivity),
    logThickness: Math.log(layer.thickness), 
    depth: layer.depth 
}));

let currentIterationModel = [...initialLogModel];
let iterationCount = 0;
let nullMetricArr = [];
let vFactor = 2;
let inversionProgress = 0;
let nextDampingCoefficient = null;

const logResistivitiesVect = logResistivities.map(resistivity => [resistivity]);

const logDomainForwardOperator = (logModel) => {
    const linearModel = logModel.map((layer, index, array) => {
        const prevLayer = array[index - 1];
        const thickness = Math.exp(layer.logThickness); 
        return {
            resistivity: Math.exp(layer.logResistivity),
            thickness: thickness,
            depth: (thickness + prevLayer?.depth) || thickness
        };
    });

    return forwardModelOperator(linearModel);
};


//  Jacobian matrix construction 
const evalForwardDiffJacobian = (logModel, modelResponseVect) => {
    let j = 0;
    let N = 0;
    const Δ = 1e-6; 

    return (resistGraph.createMatrix([resistivitiesNo, (2 * modelParamsNo) - 1], (i) => {
        const δM = Array((2 * modelParamsNo) - 1).fill(0);
        δM[j] = Δ; 

        let perturbation = 0;
        const perturbedLogModel = logModel.map((layer, index) => {
            const ΔlogResistivity = layer.logResistivity + ((δM[index] * (1 + layer.logResistivity)) || 0);
            const ΔlogThickness = layer.logThickness + ((δM[index + modelParamsNo] * (1 + layer.logThickness)) || 0);

            return {
                logResistivity: ΔlogResistivity,
                logThickness: ΔlogThickness,
            };
        });

        // console.log(perturbation)
        const perturbedResponse = logDomainForwardOperator(perturbedLogModel)[N][0];
        const originalResponse = modelResponseVect[N][0];
        const jacobianElem = (perturbedResponse - originalResponse) / Δ; 

        ++j;
        if (j === ((2 * modelParamsNo) - 1)) {
            j = 0;
            ++N;
        }
        return jacobianElem;
    }));
};

let count = 0;
console.time('LM Scheme - Full Log Domain');
while (iterationCount < ITERATION_LIMIT) {
    if (nullMetricArr.length > 2) break;

    const previousModel = [...currentIterationModel];
    const previousModelParamsVect = [];

    const previousModelResponseVect = logDomainForwardOperator(previousModel);
    const residualVect = resistGraph.differenceHandler(logResistivitiesVect, previousModelResponseVect);
    const χ = (resistGraph.productHandler(resistGraph.getTranspose(residualVect), residualVect))[0][0];

    // Fill parameter vector for convergence check
    for (let i = 0; i < previousModel.length; ++i) {
        previousModelParamsVect[i] = [previousModel[i].logResistivity];
        if (i < previousModel.length - 1) { // Last layer has no thickness parameter
             previousModelParamsVect[i + modelParamsNo] = [previousModel[i].logThickness];
        }
    }

    const jacobian = evalForwardDiffJacobian(previousModel, previousModelResponseVect);
    const jacobianTranspose = resistGraph.getTranspose(jacobian);

    const hessian = resistGraph.productHandler(jacobianTranspose, jacobian);
    const gFactor = resistGraph.productHandler(jacobianTranspose, residualVect);
    const iterationMaxError = resistGraph.getMaxElem(gFactor);

    let dampingCoefficient = 0;

    if (iterationCount === 0) {
        const hessianDiag = resistGraph.createDiagonalMatrix(hessian);
        dampingCoefficient = 1e-3 * resistGraph.getMaxElem(hessianDiag); 
    } else {
        dampingCoefficient = nextDampingCoefficient;
    }

    if (!isFinite(dampingCoefficient)) break;

    const pertubationVectDenominator = resistGraph.getInverse(
        resistGraph.sumHandler(
            hessian,
            resistGraph.productHandler(
                dampingCoefficient,
                resistGraph.createIdentityMatrix((2 * modelParamsNo) - 1)[['_data']]
            )
        )
    );

    const pertubationVect = resistGraph.productHandler(pertubationVectDenominator, gFactor);

    currentIterationModel = currentIterationModel.map((layer, index) => {
        const logResistivityUpdate = layer.logResistivity + pertubationVect[index][0];
        let logThicknessUpdate = layer.logThickness;

        // The last layer has infinite thickness, so we don't update it.
        if (pertubationVect[index + modelParamsNo] !== undefined) {
            logThicknessUpdate = layer.logThickness + pertubationVect[index + modelParamsNo][0];
            logThicknessUpdate = Math.min(logThicknessUpdate, paramUpperBound);
        }

        return {
            logResistivity: Math.min(logResistivityUpdate, paramUpperBound),
            // logResistivity: logResistivityUpdate,
            logThickness: logThicknessUpdate
        };
    });

    const currentModelResponsevect = logDomainForwardOperator(currentIterationModel);
    const currentModelResidualVect = resistGraph.differenceHandler(logResistivitiesVect, currentModelResponsevect);
    const Δχ = (resistGraph.productHandler(resistGraph.getTranspose(currentModelResidualVect), currentModelResidualVect))[0][0];

    const metricNumerator = χ - Δχ;
    const metricDenominator = resistGraph.productHandler(
        resistGraph.getTranspose(pertubationVect),
        resistGraph.sumHandler(
            resistGraph.productHandler(dampingCoefficient, pertubationVect),
            gFactor
        )
    )[0][0];

    const metric = metricNumerator / metricDenominator;

    if (metric > 0) {
        vFactor = 2;
        nullMetricArr = [];
        const metricDampingCoefficient = (1 - Math.pow(((2 * metric) - 1), 3));
        nextDampingCoefficient = dampingCoefficient * Math.max(1 / 3, metricDampingCoefficient);
    } else {
        if (metric === 0) nullMetricArr.push(metric);
        else nullMetricArr = [];
        currentIterationModel = previousModel;
        nextDampingCoefficient = dampingCoefficient * vFactor;
        vFactor *= 2;
    }

    const chiSquaredConvergence = χ / (resistivitiesNo - modelParamsNo);
    if (Math.abs(iterationMaxError) < maxError || chiSquaredConvergence < maxError) {
      console.log("suitable convergence reached!")
      console.log(`iterationMaxError:${iterationMaxError}`, `chiSquaredConvergence:${chiSquaredConvergence}`)
        break;
    }

  // Update progress
  const progress = inversionProgress + Math.round((iterationCount / ITERATION_LIMIT) * 100);
  if (progress < 100) {
    if (((progress % 10) === 0) && inversionProgress !== progress) {
      inversionProgress = progress;
      resistGraph.inversionProgressHandler(progress);
    }
  }

    ++iterationCount; ++count
}
console.log(count)

// Final model presented in linear domain.
let depth = 0;
const finalModel = currentIterationModel.map((layer) => {
    const thickness = Math.exp(layer.logThickness);
    depth += thickness;

    return {
        resistivity: Math.exp(layer.logResistivity),
        thickness: thickness,
        depth
    };
});

console.log("Final Inverted Model:", finalModel);
console.timeEnd('LM Scheme - Full Log Domain');

 resistGraph.inversionProgressHandler(100);

const logInversionResistivities = forwardModelOperator(finalModel);
const RRMSE = evalRRMSE(distances,resistivities, logInversionResistivities);
document.getElementById('RMSE').innerHTML = `RMSE: ${RRMSE.toFixed(3)}%`

// Set the dimensions of the SVG container
const width = 800;
const height = 400;

const modelData = logInversionResistivities.map((response,index) => ({x:distances[index],y:Math.exp(response[0])}));
const measuredData = resistivities.map((resistivity,index) => ({x:distances[index],y:resistivity}));


D3.plot(width,height,measuredData,modelData);
gsapAnim.fromTo('circle',{y:'10px', opacity: 0}, {y:'0px', opacity: 1, duration:.5, stagger:.06, ease: 'power3.out'});



