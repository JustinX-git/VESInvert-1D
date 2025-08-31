const distances =  resistGraph.dataPoints.distances;
const resistivities =  resistGraph.dataPoints.resistivities;




// Evaluating RRMSE(Relative Root Mean Square Error)
const evalRRMSE = (observedXs,observedYs, modelResponseVect) =>{
  let errorSquareSum = 0;
  observedXs.forEach((observedX, index) =>{
      // errorSquareSum +=   Math.pow((observedYs[index] - modelResponseVect[index][0])/observedYs[index], 2);
      errorSquareSum += Math.pow(observedYs[index] - modelResponseVect[index][0], 2);
  });
  const RMSE = Math.sqrt(errorSquareSum/observedXs.length);
  return RMSE;
}


//Parameters
const initialModel = [
  {resistivity:100,thickness: 5, depth: 5},
  {resistivity: 50, thickness: 20, depth: 25},
  {resistivity:10,thickness: Infinity, depth: null}
];
const modelParamsNo = initialModel.length

// const distances = [1,2,3,5,7,10,15,20,25,30,40,50,60,80,100,120,150,200,250,300];
// const resistivities = [99.5,99.52,98.48,94.26,87.95,77.63,64.02,55.24,49.02,43.93,35.31,28.31,22.96,16.4,13.29,11.85,10.94,10.44,10.26,10.18];




const resistivitiesVect = resistivities.map(resistivity => [resistivity]);

//Field data statistical properties
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



//DEFINING THE OBJECTIVE FUNCTION (returns Chi-Squared error criterion)
const evalChiSquaredError = (residualVect)=>{
  const chiSquaredErrorCriterion = (resistGraph.productHandler(resistGraph.getTranspose(residualVect),residualVect));
  return chiSquaredErrorCriterion[0][0];
  }

  // // LEVENBERG-MARQUADT INVERSION SCHEME
const ITERATION_LIMIT = 100;
const maxError = 1e-5;

// Initial model preparation - convert to log domain
let initialLogModel = initialModel.map(layer => ({
  logResistivity: Math.log(layer.resistivity),
  thickness: layer.thickness,
  depth: layer.depth
}));

let currentIterationModel = [...initialLogModel];
let iterationCount = 0;
let nullMetricArr = [];
let vFactor = 2;
let inversionProgress = 0;
let nextDampingCoefficient = null;

// Convert resistivities to log domain
const logResistivitiesVect = resistivities.map(resistivity => [Math.log(resistivity)]);

// Modified forward model operator that works with log-domain model
const logDomainForwardOperator = (logModel) => {
  // Convert log parameters to actual resistivity values for forward calculation
  const linearModel = logModel.map(layer => ({
    resistivity: Math.exp(layer.logResistivity),
    thickness: layer.thickness,
    depth: layer.depth
  }));
  
  // Use original forward model operator but return values directly
  return forwardModelOperator(linearModel);
};

// Modified Jacobian calculation for log domain
const evalForwardDiffJacobian = (logModel, modelResponseVect) => {
  let j = 0;
  let N = 0;
  const Δ = 1e-6;

  return (resistGraph.createMatrix([resistivitiesNo, (2 * modelParamsNo) - 1], (i) => {
    const δM = Array((2 * modelParamsNo) - 1);
    let M = 0;

    // Create perturbation vector
    while(M < modelParamsNo) {
      if(M === j) {
        // For log-resistivity, perturbation is additive in log space
        δM[M] = Δ;
      } else {
        δM[M] = 0;
      } 
      ++M;
    }

    while(M < (2 * modelParamsNo)) {
      if(M === j) {
        // For thickness, perturbation is relative to value (unchanged)
        δM[M] = Δ * (1 + logModel[M - modelParamsNo].thickness);
      } else {
        δM[M] = 0;
      } 
      ++M;
    }

    // Create perturbed model with log-resistivity perturbations
    const perturbedLogModel = logModel.map((layer, index, array) => {
      const prevLayer = array[index - 1];
      const ΔlogResistivity = layer.logResistivity + δM[index];
      const Δthickness = layer.thickness + (δM[index + modelParamsNo] || 0);
      
      // No need to check for negative values in log space
      const thicknessUpdate = Δthickness > 0 ? Δthickness : layer.thickness;
      
      return {
        logResistivity: ΔlogResistivity,
        thickness: thicknessUpdate,
        depth: prevLayer ? (thicknessUpdate + prevLayer.depth) : thicknessUpdate
      };
    });

    // Calculate Jacobian element - difference in forward response divided by perturbation size
    const perturbedResponse = logDomainForwardOperator(perturbedLogModel)[N][0];
    const originalResponse = modelResponseVect[N][0];
    const jacobianElem = (perturbedResponse - originalResponse) / resistGraph.matrixNormHandler(δM);
    
    ++j;
    if(j === ((2 * modelParamsNo) - 1)) {
      j = 0;
      ++N;
    }
    return jacobianElem;
  }));
};

console.time('LM Scheme - Log Domain');

while(iterationCount < ITERATION_LIMIT) {  
  if(nullMetricArr.length > 2) break;
  
  const previousModel = [...currentIterationModel];  
  const previousModelParamsVect = Array((2 * modelParamsNo) - 1);  
  
  // Forward model using log domain model but getting linear responses
  const previousModelResponseVect = logDomainForwardOperator(previousModel);
  
  // Calculate residuals using linear domain responses
  const residualVect = resistGraph.differenceHandler(logResistivitiesVect, previousModelResponseVect);
  const χ = evalChiSquaredError(residualVect);
  
  let jacobian = [], jacobianTranspose = [], dampingCoefficient = 0;

  // Fill parameter vector for Jacobian calculation
  for(let i = 0; i < previousModel.length; ++i) {
    previousModelParamsVect[i] = [previousModel[i].logResistivity]; 
    previousModelParamsVect[i + modelParamsNo] = [previousModel[i].thickness];
  }

  jacobian = evalForwardDiffJacobian(previousModel, previousModelResponseVect);
  jacobianTranspose = resistGraph.getTranspose(jacobian);

  const hessian = resistGraph.productHandler(jacobianTranspose, jacobian);
  const hessianDiag = resistGraph.createDiagonalMatrix(hessian);
  const gFactor = resistGraph.productHandler(jacobianTranspose, residualVect);
  const iterationMaxError = resistGraph.getMaxElem(gFactor);

  if(iterationCount === 0) {
    dampingCoefficient = 1e-6 * resistGraph.getMaxElem(hessianDiag);
  } else {
    dampingCoefficient = nextDampingCoefficient;
  }

  if(!isFinite(dampingCoefficient)) break;

  const pertubationVectNumerator = gFactor;
  const pertubationVectDenominator = resistGraph.getInverse(
    resistGraph.sumHandler(
      hessian, 
      resistGraph.productHandler(
        dampingCoefficient, 
        resistGraph.createIdentityMatrix((2 * modelParamsNo) - 1)[['_data']]
      )
    )
  );

  const pertubationVect = resistGraph.productHandler(pertubationVectDenominator, pertubationVectNumerator);
  
  // Update model parameters in log domain
  currentIterationModel = currentIterationModel.map((layer, index, array) => {
    const prevLayer = array[index - 1];
    
    // Direct update of log-resistivity (no need to check for negative values)
    const logResistivityUpdate = layer.logResistivity + pertubationVect[index][0];
    
    // For thickness, still need to ensure positive values
    const Δthickness = layer.thickness + (
      pertubationVect[index + modelParamsNo] === undefined ? 
        0 : 
        pertubationVect[index + modelParamsNo][0]
    );
    const thicknessUpdate = Δthickness > 0 ? Δthickness : layer.thickness;
    
    return {
      logResistivity: logResistivityUpdate,
      thickness: thicknessUpdate,
      depth: prevLayer ? (thicknessUpdate + prevLayer.depth) : thicknessUpdate
    };
  });

  // Log the model in linear domain for display
  console.log(currentIterationModel.map(layer => ({
    resistivity: Math.exp(layer.logResistivity),
    thickness: layer.thickness,
    depth: layer.depth
  })));
  
  const currentModelResponsevect = logDomainForwardOperator(currentIterationModel);

  // Calculate improvement metrics
  const currentModelResidualVect = resistGraph.differenceHandler(logResistivitiesVect, currentModelResponsevect);
  const Δχ = evalChiSquaredError(currentModelResidualVect);

  const metricNumerator = resistGraph.differenceHandler(χ, Δχ);
  const metricDenominator = resistGraph.productHandler(
    resistGraph.getTranspose(pertubationVect),
    resistGraph.sumHandler(
      resistGraph.productHandler(dampingCoefficient, pertubationVect),
      gFactor
    )
  );

  const metric = metricNumerator / metricDenominator;
  
  // Update damping parameter based on success of iteration
  if(metric > 0) {
    vFactor = 2;
    nullMetricArr = [];
    const metricDampingCoefficient = (1 - Math.pow(((2 * metric) - 1), 3));
    nextDampingCoefficient = dampingCoefficient * Math.max(1/3, metricDampingCoefficient);
  } else {
    if(metric === 0) nullMetricArr.push(metric);
    else nullMetricArr = [];
    currentIterationModel = previousModel;
    nextDampingCoefficient = dampingCoefficient * vFactor;
    vFactor *= 2;   
  }

  // Stopping criteria
  const coeffConvergencevect = pertubationVect.map((each, index) => {
    return isNaN(each[0] / previousModelParamsVect[index][0]) ? 0 : each[0] / previousModelParamsVect[index][0]; 
  });
  const chiSquaredConvergence = χ / (resistivitiesNo - modelParamsNo);

  if(Math.abs(iterationMaxError) < maxError) {
    console.log('first stopping criterion');
    break;
  } else if(Math.abs(Math.max(coeffConvergencevect)) < maxError) {
    console.log("second stopping criterion");
    break;
  } else if(chiSquaredConvergence < maxError) {
    console.log("third stopping criterion");
    break;
  }
  
  console.log(`χ: ${χ}`);
  console.log(`Δχ: ${Δχ}`);
  console.log(`metric: ${metric}`);
  console.log(`dampingCoefficient: ${dampingCoefficient}`);
  console.log(`metricNum: ${metricNumerator}`);
  console.log(`metricDenum: ${metricDenominator}`);

  ++iterationCount;
  
  // Update progress
  const progress = inversionProgress + Math.round((iterationCount / ITERATION_LIMIT) * 100);
  if(progress < 100) {
    if(((progress % 2) === 0) && inversionProgress !== progress) {
      inversionProgress = progress;
      resistGraph.inversionProgressHandler(progress);
    }
  }
}

// Convert final model back to linear domain for output
const finalModel = currentIterationModel.map(layer => ({
  resistivity: Math.exp(layer.logResistivity),
  thickness: layer.thickness,
  depth: layer.depth
}));

console.timeEnd('LM Scheme - Log Domain');

//Sets progress to 100 since inversion is completed
 resistGraph.inversionProgressHandler(100);

console.log(finalModel);

const inversionResistivities = forwardModelOperator(finalModel).map(rho => [Math.exp(rho[0])]);
const RRMSE = evalRRMSE(distances,resistivities, inversionResistivities);
document.getElementById('RMSE').innerHTML = `RMSE: ${RRMSE.toFixed(3)}`

// Set the dimensions of the SVG container
const width = 800;
const height = 400;

const modelData = inversionResistivities.map((response,index) => ({x:distances[index],y:response[0]}));
const measuredData = resistivities.map((resistivity,index) => ({x:distances[index],y:resistivity}));


D3.plot(width,height,measuredData,modelData);
document.querySelectorAll('.domain').forEach(each =>{
  each.animate(
      [
        // keyframes
        { opacity: "0"},
        {opacity: "1"},
      ],
      {
        // timing options
        duration: 2000,
        fill:"forwards"
      },
    );
});

gsapAnim.fromTo('circle',{y:'10px', opacity: 0}, {y:'0px', opacity: 1, duration:.5, stagger:.05, ease: 'power3.out'});




