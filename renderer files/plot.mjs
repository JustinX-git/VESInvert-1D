// const Plotly = resistGraph.getPlotly();
// const RESIST_GRAPH_DIV = document.getElementById('resist-graph');
// const data = {
//     x: resistGraph.dataPoints.distances,
//     y: resistGraph.dataPoints.resistivities,
//     mode: 'markers',
//     type: 'scatter'
// };







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
 // <----- SYNTHETIC MODELS WITH KNOWN TRUE MODELS ----->

    //M Heriyanto and W Srigutomo Synthetic Data (1)
 //True model
  // {resistivity:108,thickness: 5, depth: 5},
  // {resistivity: 52, thickness: 20, depth: 25},
  // {resistivity:11,thickness: Infinity, depth: null}

    //M Heriyanto and W Srigutomo Synthetic Data (2)
 //True model
  // {resistivity:100,thickness: 5, depth: 5},
  // {resistivity: 50, thickness: 20, depth: 25},
  // {resistivity:10,thickness: Infinity, depth: null}

  //M Heriyanto and W Srigutomo Synthetic Data (3)
  //True Model
  // {resistivity:10,thickness: 10, depth: 10},
  // {resistivity: 10, thickness: 10, depth: 20},
  // {resistivity:10,thickness: Infinity, depth: null}

  //Ojo Synthetic Five Layer Model
  //True model
  {resistivity:100,thickness: 2, depth: 2},
  {resistivity:500, thickness: 20, depth: 22},
  {resistivity: 200,thickness: 15, depth: 37},
  {resistivity:5000,thickness: 40, depth: 77},
  {resistivity: 750, thickness: Infinity, depth: null}

  //Ojo Synthetic Seven Layer Model
  //True model
  // {resistivity:750,thickness: 2, depth: 2},
  // {resistivity:200, thickness: 13, depth: 15},
  // {resistivity: 2500,thickness: 75, depth: 90},
  // {resistivity:650,thickness: 30, depth: 120},
  // {resistivity:5000,thickness: 130, depth: 250},
  // {resistivity:450,thickness: 50, depth: 300},
  // {resistivity: 7500, thickness: Infinity, depth: null}

//Ekinci & Dermici synthetic three layer model (1)
  // {resistivity:100,thickness: 5, depth: 5},
  // {resistivity: 50, thickness: 5, depth: 10},
  // {resistivity:20,thickness: Infinity, depth: null}

//Ekinci & Dermici synthetic three layer model (2)
// {resistivity: 50, thickness: 5, depth: 5},
//   {resistivity:100,thickness: 10, depth: 15},
//   {resistivity:20,thickness: Infinity, depth: null}

//Ekinci & Dermici synthetic three layer model (3)
//Original
// {resistivity:100,thickness: 5, depth: 5},
// {resistivity: 50, thickness: 10, depth: 15},
// {resistivity: 20, thickness: 20, depth: 35},
//   {resistivity:10,thickness: Infinity, depth: null}

// {resistivity:200,thickness: 2, depth: 2},
// {resistivity: 120, thickness: 3, depth: 5},
// {resistivity: 60, thickness: 36, depth: 41},
//   {resistivity:27,thickness: Infinity, depth: null}

// {resistivity:120,thickness: 6, depth: 2},
// {resistivity: 70, thickness: 11, depth: 5},
// {resistivity: 35, thickness: 17.8, depth: 41},
//   {resistivity:11,thickness: Infinity, depth: null}

    // {resistivity: 98.57774378814634,thickness: 3.0522903257844116,depth: 3.0522903257844116},
    // {resistivity: 426.36562283912457,thickness: 0.3611752669991186,depth: 3.4135129157058106},
    // {resistivity: 45.68722926891336,thickness: 16.623224027561953,depth: 20.036682536503392},
    // {resistivity: 10.742065892839587,thickness: Infinity,depth: null}


  // <----- REAL DATA MODELS (UKNOWN TRUE MODEL) ----->

   //Akpabuyo LGA
   //Original
  // {resistivity:939.58,thickness: 2.25, depth: 2.25},
  // {resistivity:2162.94,thickness: 20, depth: 22.5},
  // {resistivity:1468.98,thickness: 40, depth: 62.5},
  // {resistivity:800,thickness: 50, depth: 112.5},
  // {resistivity:1175.34,thickness: Infinity, depth: null}

  // {resistivity:100,thickness: 0.5, depth: 0.5},
  // {resistivity:3104,thickness: 1.5, depth: 2},
  // {resistivity:350,thickness: 11.5, depth: 13.5},
  // {resistivity:130,thickness: 45, depth: 58.5},
  // {resistivity:1175.34,thickness: Infinity, depth: null}

    // Excel Homework
  // {resistivity:428.956964,thickness: 1, depth: 1},
  // {resistivity:725.3107904, thickness: 1.5, depth: 2.5},
  // {resistivity:100.7315039,thickness: 7.5, depth:10},
  // {resistivity:472.0615705,thickness: 30, depth: 40},
  // {resistivity:558.5995894, thickness: Infinity, depth: null}

   //Youtube Video (Time: 18876)
// {resistivity:220,thickness: 0.5, depth: 0.5},
//     {resistivity:60, thickness: 1, depth: 1.5},
//     {resistivity:1450,thickness: Infinity, depth: null}

    // Area North of Tenth of Ramadan City (Egypt)(VES 1) 
  // {resistivity:145,thickness: 0.5, depth: 0.5},
  // {resistivity:29, thickness: 6.5, depth: 7},
  // {resistivity:37,thickness: 13, depth:20},
  // {resistivity:76.7,thickness: 80, depth: 100},
  // {resistivity:201, thickness: Infinity, depth: null}

  // Area North of Tenth of Ramadan City (Egypt)(VES 12)  (Time: 40849)
  // {resistivity:80,thickness: 0.5, depth: 0.5},
  // {resistivity:33, thickness: 1, depth: 1},
  // {resistivity:28,thickness: 7, depth: 18},
  // {resistivity:75,thickness: 120, depth: 68},
  // {resistivity:45, thickness: Infinity, depth: null}

  // Area North of Tenth of Ramadan City (Egypt)(VES 17)  (Time: 40849)
  // {resistivity:373,thickness: 0.5, depth: 0.5},
  // {resistivity:141, thickness: 1.5, depth: 2},
  // {resistivity:73,thickness: 4, depth: 6},
  // {resistivity:60,thickness: 10, depth: 16},
  // {resistivity:17.5, thickness: Infinity, depth: null}

    // Area North of Tenth of Ramadan City (Egypt)(VES 19)
  // {resistivity:250,thickness: 0.5, depth: 0.5},
  // {resistivity:200, thickness: 3, depth: 3.5},
  // {resistivity: 36,thickness: 5, depth: 8.5},
  // {resistivity:57,thickness: 43, depth: 51.5},
  // {resistivity: 4, thickness: Infinity, depth: null}

    // Step Curve Data (Time: 98212)
  //Original
  // {resistivity:10.829,thickness: 0.5, depth: 0.5},
  // {resistivity: 24.273, thickness: 0.5, depth: 1},
  // {resistivity:20.009,thickness: 4, depth:5},
  // {resistivity:95.822,thickness: 25, depth: 30},
  // {resistivity:121.392,thickness: 95, depth: 125},
  // {resistivity:500, thickness: Infinity, depth: Infinity}
];
const modelParamsNo = initialModel.length

// SAMPLE DATA
  // <----- SYNTHETIC DATA SETS ----->
//M Heriyanto and W Srigutomo Synthetic Data (1)
// const distances = [1,2,3,5,7,10,15,20,25,30,40,50,60,80,100,120,150,200,250,300];
// const resistivities = [109.78,100.05,111.02,107.46,96.9,86.45,71.15,58.49,53.84,45.06,39.05,28.44,23.92,16.51,13.48,13.31,12.08,10.94,11.72,10.23];

//M Heriyanto and W Srigutomo Synthetic Data (2)
// const distances = [1,2,3,5,7,10,15,20,25,30,40,50,60,80,100,120,150,200,250,300];
// const resistivities = [99.5,99.52,98.48,94.26,87.95,77.63,64.02,55.24,49.02,43.93,35.31,28.31,22.96,16.4,13.29,11.85,10.94,10.44,10.26,10.18];

//M Heriyanto and W Srigutomo Synthetic Data (3)
// const distances = [1,2,3,5,7,10,15,20,25,30,40,50,60,80,100,120,150,200,250,300];
// const resistivities = [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];

//Ojo Synthetic Five Layer Model
const distances = [1,1.47,2.15,3.16,4.64,6.51,10,14.58,21.54,31.52,45.52,68.13,100,146.7,215.44,316.23,464.16,681.29,1000,1467.8];
const resistivities = [100.17,106.17,116.27,137.63,173.24,220.42,273.64,326.93,373.64,409.24,442.06,502.11,620.32,704.05,942.07,1039.46,1042.13,965.7,870.66,805.61];

//Ojo Synthetic Seven Layer Model
// const distances = [1,1.47,2.15,3.16,4.64,6.51,10,14.58,21.54,31.52,45.52,68.13,100,146.7,215.44,316.23,464.16,681.29,1000,1467.8];
// const resistivities = [738.95,717.64,685.69,585.11,427.55,306.64,253.17,256.55,307.9,408.1,554.45,741.19,961.11,1201.22,1450.92,1717,2020.09,2375.34,2834.7,3450.8];


//Ekinci & Dermici synthetic three layer model data(1)
// const distances = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300];
// const resistivities = [99.95, 99.51, 98.44, 94.08, 87.50, 76.48, 61.09, 50.37, 42.75, 37.14, 29.88, 25.92, 23.75, 21.80, 21.05, 20.69, 20.42, 20.23, 20.15, 20.10];

//Ekinci & Dermici synthetic three layer model data (2)
// const distances = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300];
// const resistivities = [47.52, 47.74, 48.23, 50.18, 53.03, 63.45, 61.58, 61.36, 58.25, 59.37, 48.70, 36.15, 30.55, 26.97, 21.82, 22.85, 22.04, 21.53, 21.32, 19.20]

//Ekinci & Dermici synthetic three layer model data (3)
// const distances = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300];
//  const resistivities = [104.95, 94.54, 93.52, 98.78, 91.86, 72.60, 57.84, 52.40, 39.82, 37.62, 26.02, 21.01, 19.65, 15.58, 12.25, 12.44, 10.51, 10.01,10.84, 10.73];


  // <----- REAL DATA SETS ----->
//AkpaBuyo Data
// const distances = [1.00, 1.50, 2.00, 3.00, 4.00, 5.00, 7.00,12.00,17.00,27.00,37.00, 47.00,67.00,117.00, 167.00,217.00, 267.00];
// const resistivities = [505.7284, 699.9053, 902.0600,1279.47,1004.3590, 1521.4335, 2020.3217, 2252.1811, 2726.43472, 2863.3286, 2659.0984, 2249.5478,1065.814,360.5608,650.0000,950.0000,1175.3402];

// Excel Homework
// const distances = [1.00, 1.5, 2.00, 3.00, 4.00, 5.00,6.00,8.00,10.00,15.00, 20.00,30.00,40.00, 50.00,60.00, 80.00,100,150];
// const resistivities = [271.392352, 380.914875,428.956964, 478.9201248,542.1031953,525.3107904,459.1668478,384.513907, 341.3500923, 255.426615, 222.7315039, 258.6682395, 324.4243172 ,386.7998881,453.9880593,490.1350817,576.202196,558.5995894];

//Youtube Video (Shift: 15)
// const distances = [1.00, 2.00, 3.00, 5.00, 6.00, 8.00,10.00,15.00,20.00,30.00, 40.00,50.00,60.00, 70,80, 90,100];
// const resistivities = [225.83, 203.776,124.015,120.6691, 125.3801,152.8004,226.5781,323.1395,261.2191, 536.4848, 609.045, 641.6375, 773.2266, 958.4209 ,1132.531,1147.513,1249.795];

// Area North of Tenth of Ramadan City (Egypt) (VES 1)
// const distances= [1, 1.4, 2, 3, 4, 3, 4, 6, 8, 10, 14, 10, 14, 20, 30, 40, 30, 40, 60, 80, 100, 140, 100, 140, 200, 300, 400, 500];
// const resistivities = [145.5, 130.7, 102.4, 67.8, 45.7, 81.9, 55.8, 39.5, 32.5, 30.3,29.8, 30.9, 29.9, 32.5, 40.5, 41.4, 36.9, 37.9, 48.8, 61.3,71.4, 77.4, 64.7, 70.8, 76.7, 57.8, 91.8, 201];

// Area North of Tenth of Ramadan City (Egypt) (VES 12)
// const distances= [1, 1.4, 2, 3, 4, 3, 4, 6, 8, 10, 14, 10, 14, 20, 30, 40, 30, 40, 60, 80, 100, 140, 100, 140, 200, 300, 400];
// const resistivities = [
//   96, 86.2, 65.7, 49.6, 40.3, 54.4, 43.6, 36.9, 30.2, 27.6, 26.9, 29.2, 28.3, 29.9, 33.9, 39.1, 29.7, 34.3, 42.7, 45.8, 50.1, 58.6, 55.3, 60.9, 46.8, 49.4, 33];

// Area North of Tenth of Ramadan City (Egypt) (VES 17)
// const distances= [1, 1.4, 2, 3, 4, 3, 4, 6, 8, 10, 14, 10, 14, 20, 30, 40, 30, 40, 60, 80, 100, 140, 100, 140, 200, 300, 400, 500];
// const resistivities = [373.3, 365.5, 405.6, 317.7, 202.4, 220, 141.3, 120.4, 80.8, 62,61.2, 72.7, 67.5, 68.1, 73.9, 66.9, 46.6, 42.6, 44.8, 45.7, 44, 43.1, 43.1, 42.6, 36.9, 30.8, 23.8, 17.5];

// Area North of Tenth of Ramadan City (Egypt) (VES 19)
// const distances= [1, 1.4, 2, 3, 4, 3, 4, 6, 8, 10, 14, 10, 14, 20, 30, 40, 30, 40, 60, 80, 100, 140, 100, 140, 200, 300, 400, 500];
// const resistivities = [198, 163.8, 146.1, 133.6, 114.4, 142.2, 121.3, 80.5, 57, 43.7,30.6, 52.7, 35.6, 36.1, 44.8, 52.4, 40.3, 46.3, 56.8, 58.1, 57.4, 52.8, 56.6, 50.7, 36.7, 19.7, 13.1, 4];

// Step Curve Data
// const distances = [1,1.5,2,3,4,5,6,8,10,12.5,15,17.5,20,25,30,40,50,60,80,100,125,150,175,200,250,300,350,400,500];
// const resistivities = [17.829,22.428,24.373,21.446,20.697,20.429,20.954,21.909,24.009,27.994,33.065,38.542,43.075,50.889,62.753,76.834,87.987,95.822,100.797,107.537,108.777,108.999,111.012,113.333,121.392,125.987,135.855,148.467,162.219];

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


// Temporary convolution sum calculation. Would eventually figure out how to fit into a for loop.
let i = 0;
convolutionSum = 105*transformArray[i] - 262*transformArray[i+2] + 416*transformArray[i+4] - 746*transformArray[i+6] + 1605*transformArray[i+8];
convolutionSum = convolutionSum - 4390*transformArray[i+10] + 13396*transformArray[i+12] - 27841*transformArray[i+14];
convolutionSum = convolutionSum + 16448*transformArray[i+16] + 8183*transformArray[i+18] + 2525*transformArray[i+20];
convolutionSum = (convolutionSum + 336*transformArray[i+22] + 225*transformArray[i+24]) / 10000;


/*   let testSum = 0;
  for (let i = 0; i < 13; ++i){
  convolutionSum += inverseFilterCoeffs[i] * transformArray[i * 2];

  testSum += inverseFilterCoeffs[i] * transformArray[i * 2] * 10000;
  console.log(i*2)
  };

  console.log(testSum/10000) */
   
/* let i = 0;
  let g = (inverseFilterCoeffs[0]*10000)*transformArray[0]+(inverseFilterCoeffs[1]*10000)*transformArray[2]+(inverseFilterCoeffs[2]*10000)*transformArray[4]+(inverseFilterCoeffs[3]*10000)*transformArray[6]+(inverseFilterCoeffs[4]*10000)*transformArray[8];
  console.log(g) */

  // console.log(convolutionSum)
  return convolutionSum;
}


// FORWARD MODEL OPERATOR
const forwardModelOperator = (model)=>{  
  const modelRoaVect = distances.map(distance => [deconvolver(distance, model)]); 
  return modelRoaVect.map(rho => [Math.log(rho[0])]);
  // return modelRoaVect 
}



//DEFINING THE OBJECTIVE FUNCTION (returns Chi-Squared error criterion)
const evalChiSquaredError = (residualVect)=>{
  const chiSquaredErrorCriterion = (resistGraph.productHandler(resistGraph.getTranspose(residualVect),residualVect));
  return chiSquaredErrorCriterion[0][0];
  }


// let previousProgress = undefined;
// const paramSearchIterationAmt = (100 * modelParamsNo) + (200 * (modelParamsNo - 1));
// const optimalInitialParamSearchHandler = (model,type,counter) =>{
//   let currentModel = [...model];
//   let optimalModelResponse = [];
//   let optimalModelObj = {};
//   let resIncrement = 100;
//   let thicknessIncrement = 1;
//   let iterationCount = counter;
//   let modelReposnse = forwardModelOperator(model);
  
//   const maxParam = type === "resistivity" ? 5000 : 100;
//   const models = [model];
//   const errorArr = [evalChiSquaredError(resistGraph.differenceHandler(observedTransformValues, modelReposnse))];
//   // const responseArr = [modelReposnse];

//   const iterationThreshold = type === "resistivity" ? modelParamsNo : modelParamsNo - 1;
//    for(let i = 0; i < iterationThreshold; i++){
//     const index = (iterationThreshold - 1) - i;
//     let currentParam = type === "resistivity" ? 100 : 1;
 
//     while((currentParam <= maxParam)){
//         if(type === "resistivity"){
//             currentModel[i] = {
//                 ...currentModel[i],
//                   resistivity: currentParam, 
//             }
//         }else{
//             const prevLayer = currentModel[i - 1];
//             currentModel[i] = {
//                 ...currentModel[i],
//                 thickness: currentParam,
//                 depth: prevLayer ? (currentParam + prevLayer.depth) : currentParam
//             }
//         }

//     modelReposnse = forwardModelOperator(currentModel);
   
//       errorArr.push(evalChiSquaredError(resistGraph.differenceHandler(observedTransformValues, modelReposnse)));
//       models.push([...currentModel]);
//       // responseArr.push(modelReposnseObj.optimalResponse.response);

//       currentParam += type === "resistivity" ? resIncrement : thicknessIncrement;
//       iterationCount += 1;
//       const progress = parseInt(String((iterationCount/paramSearchIterationAmt) * 40))
//       if(((progress % 10) === 0) && previousProgress !== progress){
//          previousProgress = progress;
//          resistGraph.inversionProgressHandler(progress);
//       }
//     };
//     const optimalModelIndex = errorArr.findIndex(err => err === Math.min(...errorArr));
//     console.log(errorArr[optimalModelIndex])
//     const optimalModel = models[optimalModelIndex];
//     // optimalModelResponse = responseArr[optimalModelIndex];
//     currentModel = [...optimalModel];
//      if((i === (modelParamsNo - 1)) && (type === "resistivity")){
//         optimalModelObj = optimalInitialParamSearchHandler(currentModel,"thickness",iterationCount)
//      }
//    };
//    return type === "resistivity" ? optimalModelObj : currentModel;
// };

// console.time('optimalParam Search');
// // const searchTimerStart = window.performance.now();
// const optimalModelParamObj =  optimalInitialParamSearchHandler(initialModel,"resistivity",0);
// // const searchTimerStop = Math.round(window.performance.now() - searchTimerStart)
// console.timeEnd('optimalParam Search');


  // // LEVENBERG-MARQUADT INVERSION SCHEME
 // Modify these existing constants
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

console.log("Final Model (Linear Domain):", finalModel);
console.timeEnd('LM Scheme - Log Domain');

//Sets progress to 100 since inversion is completed
 resistGraph.inversionProgressHandler(100);

console.log(finalModel);
// const computedTransformValues = forwardModelOperator(currentIterationModel);

// console.log(observedTransformValues);
// console.log(computedTransformValues);
// console.log(transformAbscissas);


// const inversionResistivities = deconvolver(computedTransformValues);

/* UNCOMMENT TO PRODUCE PREVIOUS OUTPUT */
const inversionResistivities = forwardModelOperator(finalModel).map(rho => [Math.exp(rho[0])]);
// console.log(inversionResistivities);
// console.log(currentIterationModel); 

// const deconvolverObj = forwardModelDeconvolver(transformAbscissas,transformValues);
// const resistivityValues = evalWeightingMatrix().y;
// const resistivityAbscissas = evalWeightingMatrix().x

// forwardModelDeconvolver(transformAbscissas,transformValues);

// const test = [[1,2,3],[1,7,8],[2,5,9]]; //15.42725...
// console.log(resistGraph.matrixNormHandler(test,'fro'))
// const finalModelResponse = forwardModelOperator(currentIterationModel);
const RRMSE = evalRRMSE(distances,resistivities, inversionResistivities);
document.getElementById('RMSE').innerHTML = `RMSE: ${RRMSE.toFixed(3)}`




// Set the dimensions of the SVG container
const width = 800;
const height = 400;

const modelData = inversionResistivities.map((response,index) => ({x:distances[index],y:response[0]}));
// const modelData = resistivityValues.map((resistivityValue,index) => ({x:resistivityAbscissas[index],y:resistivityValue}));
const measuredData = resistivities.map((resistivity,index) => ({x:distances[index],y:resistivity}));

// console.log(transformValues);
// console.log(transformAbscissas);
console.log(modelData);
console.log(measuredData);
// console.log(currentIterationModel);
D3.freeStyle(width,height,measuredData,modelData);
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



// DECONVOLUTION TO OBTAIN RESISTVITY SAMPLES FROM TRANSFORM SAMPLES
/* 
const deconvolutionFilters = [0.0225, -0.0499, 0.1064, 0.1854, 1.9720, -1.5716, 0.4018, -0.0814, 0.0148];


  const leftExtrapolatedTransformSamples = [unextrapolatedTransformSamples[0], unextrapolatedTransformSamples[0], unextrapolatedTransformSamples[0], unextrapolatedTransformSamples[0], unextrapolatedTransformSamples[0],];
    const rightExtrapolatedTransformSamples = [unextrapolatedTransformSamples[unextrapolatedTransformSamples.length - 1],unextrapolatedTransformSamples[unextrapolatedTransformSamples.length - 1],unextrapolatedTransformSamples[unextrapolatedTransformSamples.length - 1]];

    const transformSamples = (leftExtrapolatedTransformSamples.concat(unextrapolatedTransformSamples)).concat(rightExtrapolatedTransformSamples);

    const resistivityDeconvolutionSamples = []; 
    const resistivitySamplesNo = transformSamples.length - 8;
  
  
    for(let m = 0; m < resistivitySamplesNo; ++m){
      let j = -3, convolutionSum = 0;
      while(j <= 5){
           convolutionSum += deconvolutionFilters[j + 3] * transformSamples[(m - j) + 5];
           ++j;
          };
          resistivityDeconvolutionSamples.push(Math.exp(convolutionSum));
       }

       const unextrapolatedHalfSpacings = (halfSpacingSamples.slice(5,halfSpacingSamples.length - 3)).map(halfSpacing => Math.exp(halfSpacing));

       const datum = distances.map(distance => resistGraph.getInterpolant(unextrapolatedHalfSpacings,resistivityDeconvolutionSamples,distance));



       //LEETCODE PRACTICE CODES HERE, WOULD REMOVE EVENTUALLY
*/
// var expressiveWords = function(s, words) {
//   let stretchyCount = 0;
//   const s_Arr = s.split("");
//   const s_Set = new Set(s_Arr);
//   const s_Obj = {};
//   for(let i = 0; i < s_Arr.length; i++){
//       if(!s_Obj[s_Arr[i]]) s_Obj[s_Arr[i]] = 1
//       else s_Obj[s_Arr[i]]++
//   };

//   for(let j = 0; j < words.length; j++){
//      const word_Arr = words[j].split("");
//      const word_Set = new Set(word_Arr);
//      const word_Obj = {};
//      if(word_Set.symmetricDifference(s_Set).size){
//         for(let k = 0; k <  word_Arr.length; k++){
//            if(!word_Obj[word_Arr[k]]) word_Obj[word_Arr[k]] = 1
//            else  word_Obj[word_Arr[k]]++
//         };
//         for(const char in word_Obj){
//            if((word_Obj[char] < s_Obj[char]) && (s_Obj[char] >=3)) stretchyCount++
//         }
//      }
//   };
//   return stretchyCount;
// };

// console.log(expressiveWords("heeellooo",["hello", "hi", "helo"] ));

// const str = "   q  wert";
// for(let char of str.trim()){
//   console.log(char)
// }

// var slidingWindow = function (s, windowLength){
//   if(windowLength === 1) return s.length;
  
//   let i = 0, j = windowLength, k = s.length - windowLength;
//   let sum = 0;
//   while(i <= k){
//     const map = new Map();
//     s.split("").slice(i,j).forEach(char =>{
//       if(map.has(char)) map.set(char, 0);
//       else map.set(char,1)
//     });
//     for(let values of map.values()){
//       if(values) sum += 1;
//     }
//     i++,j++
//   }
//   return  sum + slidingWindow(s, windowLength - 1)
// };
// var uniqueLetterString = function(s) {
//      return slidingWindow(s, s.length)
// };

// console.time("uniqueLetterString")
// console.log(uniqueLetterString("ADFGHTYHG"))
// console.timeEnd("uniqueLetterString")

// var fourSumCount = function(nums1, nums2, nums3, nums4) {
//   let tuplesCount = 0,
//    n = nums1.length,
//    k = 1,
//    fourSumAnchor = null,
//    twoSum_anchorArr1 =  null,
//    twoSum_anchorArr2 =  null;
//   // const tuples = [];
//   nums1.sort((a,b)=> a-b);
//   nums3.sort((a,b)=> a-b);
//   nums4.sort((a,b)=> a-b);

//   while(k <= 3){
//     switch (k) {
//       case 2:
//         fourSumAnchor = nums3,
//         twoSum_anchorArr1 =  nums1,
//         twoSum_anchorArr2 =  nums4;
//         break;
//       case 3:
//         fourSumAnchor = nums4,
//         twoSum_anchorArr1 =  nums3,
//         twoSum_anchorArr2 =  nums1;
//         break;
    
//       default:
//         fourSumAnchor = nums1,
//         twoSum_anchorArr1 =  nums3,
//         twoSum_anchorArr2 =  nums4;
//         break;
//     }
//     for(let i = 0; i < n; i++ ){
//       for(let j = 0; j < n; j++){
//           const target = -nums2[i]-fourSumAnchor[j];
//           // console.log(target);
//           let leftPointer = 0,
//               rightPointer = n - 1;
//           while((leftPointer < n) && (rightPointer >= 0)){
//             // console.log(leftPointer,rightPointer)
//           const sum = twoSum_anchorArr1[leftPointer] + twoSum_anchorArr2[rightPointer];
//               if(sum === target){
//                 tuplesCount++;
//                 // tuples.push([nums1[i],fourSumAnchor[j],twoSum_anchorArr1[leftPointer]twoSum_anchorArr2[rightPointer]])
//                 rightPointer--, leftPointer++
//               }
//               else if (sum > target) rightPointer--
//               else leftPointer++
//           }
//       }
//   };
//   k++
//   }
//   return  tuplesCount
// };

// const nums1 = [1,2], nums2 = [-2,-1], nums3 = [-1,2], nums4 = [0,2];
// const nums1 = [-1,2,6,4,1], nums2 = [-1,-3,2,-3,-1], nums3 = [3,1,2,-7,4], nums4 = [1,-5,2,-3,1];
// const nums1 = [0,0,0,0,0], nums2 =[0,0,0,0,0], nums3 = [0,0,0,0,0], nums4 = [0,0,0,0,0];
// console.log(fourSumCount(nums1,nums2,nums3,nums4));
// console.log(threeSum([-5,-4,-3,-2,-1,0,1,2,3,4,5,6]));
// console.log(threeSum([0,0,0,0,0,0,0,0,0,0]));


// const map  = new Map();
// const str = "wrr";
// const words = ["world", "warrior","whirpool","worried"]
// // const str_reg = str[0] + "*"+str.slice(1,);
// var wordSubsets = function(words1, words2) {
//   let universalArr = [];
// for(let i = 0; i< words1.length; i++){
//     for(let j = 0; j<words2.length; j++){
//         const str_reg = words2[j].length > 1 ? `${words2[j][0]+"*"+words2[j].slice(1,)}` : words2[j];
//         const regex = new RegExp(str_reg,"gi");
//         console.log(words1[i].match(regex));
//         if(words1[i].match(regex)) {
//           universalArr.push(words1[i])
//         }
//     }
// }
// return universalArr
// };

// console.log(wordSubsets(["amazon","apple","facebook","google","leetcode"],["e","o"]))



//USEFUL CODE BLOCK FOR GENERATING INTEGER ARRAY TEST CASES 
// const randomNumGenerator = (max) =>{
//    let i = Math.random() >= 0.5 ? 1 : -1;
//    return Math.floor(Math.random() * max) * i
// }

// const nums = [];
// let k = 0;
// while(k < 100000){
//   nums.push(randomNumGenerator(k));
//   k++
// }

// console.log(nums.toString());


//USEFUL CODE BLOCK FOR GENERATING AN ARRAY OF WORDS
//For lowercase characters
// const randomLowerCharGenerator = () =>{
//   return String.fromCharCode(Math.floor(Math.random() * 25) + 97)
// }

// //For uppercase characters
// const randomUpperCharGenerator = () =>{
//    return String.fromCharCode(Math.floor(Math.random() * 25) + 65)
// }

// //For all printable ASCII characters
// const randomPrintableASCII = () =>{
//    const asciiCode = Math.floor(Math.random() * 94) + 32;
//    if(asciiCode === 39 || asciiCode === 96) return " "
//    return String.fromCharCode(asciiCode)
// }


// const randomLowerCharGenerator = () =>{
//   return String.fromCharCode(Math.floor(Math.random() * 25) + 97)
// }

// let str = "",k = 0;
// while(k < 99999){
//   str += randomLowerCharGenerator();
//   k++
// }

//console.log(str)

// Generating an array of strings
//  let str = "";
// for(let i = 0; i < 200000; i++){
//     str += randomPrintableASCII();
// }


// console.log(str.toString())

//Generating an array of strings
// const strArr = [];
// for(let i = 0; i < 10000; i++){
//   let str = "",k = 0;
//   while(k < 100){
//     str += randomLowerCharGenerator();
//     k++
//   };
//   strArr.push(`"${str}"`)
// }

// console.log(strArr.toString())

// const regex = /^[A-Za-z0-9]+$/
// const str = "565AaDd)_"
// console.log(regex.test(str));


/* function addText(cursorPos,str,textInsert){
  const prevCursorPos = cursorPos;
  cursorPos = cursorPos + textInsert.length;
  return str.slice(0, prevCursorPos) + textInsert + str.slice(prevCursorPos,)
}

function delText(cursorPos,str,delCount){
  const diff =  cursorPos - delCount,
        prevCursorPos = cursorPos;
    if(diff > 0){
      cursorPos = diff;
      str.slice(0,cursorPos) + str.slice(prevCursorPos,);
      return delCount
    }else{
      cursorPos = 0;
      const actualDelCount = prevCursorPos
      str.slice(prevCursorPos,);
      return actualDelCount
    }
};

function cursorLeft(cursorPos,str,shift){
  const diff = cursorPos - shift;
  cursorPos = diff > 0 ? diff : 0;
  return str.slice((cursorPos <= 9 ? 0 : cursorPos - 10),cursorPos)
}

function cursorRight(cursorPos,str,shift){
  const diff = cursorPos + shift;
  cursorPos = diff < str.length - 1 ? diff : str.length - 1;
  return str.slice((cursorPos <= 9 ? 0 : cursorPos - 10),cursorPos)
}
 */
