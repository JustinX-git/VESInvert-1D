const {gsap} = require('gsap');
import { multiply, inv, flatten,mean,median, polynomialRoot,square,cube,add, subtract,trace,transpose,diag,identity,norm,matrixFromFunction,max,min, det,factorial} from 'mathjs';
import Spline from 'cubic-spline';
import * as d3 from "d3";
import { sgg } from 'ml-savitzky-golay-generalized';

const { ipcRenderer, contextBridge} = require('electron');

ipcRenderer.on('plot', (ev, measuredDataPoints)=>{
    contextBridge.exposeInMainWorld('resistGraph',{
        measuredDataPoints,
        inversionProgressHandler : (progress) =>  ipcRenderer.send('progress',progress),
        getPlotly: () => require('plotly.js-dist'),
        applySmoothing: (yData,xData, options) =>{
            return sgg(yData,xData,options ?? {windowSize: 9,derivative: 0,polynomial: 3})
        },
        getCubicInterpolations: (xs,ys, lastHalfSpacing) => {
            const spline =  new Spline(xs,ys)
            let n = 1, XmeasuredData = [], YmeasuredData = []; 
            while(n <= Number(lastHalfSpacing.toFixed(1)) ){
            const N = Number(n.toFixed(1))
             XmeasuredData.push(N);
             YmeasuredData.push(spline.at(N));
             n += 0.1
          };
          return {XmeasuredData,YmeasuredData}
        },
        getInterpolant : (xs,ys,N) =>{
            const spline =  new Spline(xs,ys);
            return spline.at(N)
        },
        getLSMCoefficients: (coeffcientMatrix, outputMatrix) =>{
           return flatten(multiply(inv(coeffcientMatrix), outputMatrix))
        },
        getPolynomialRoot : (a,b,c,d) =>{
            return polynomialRoot(d,c,b,a)
        },
        evalCubicPolynomial: (cubicCoefficient,quadraticCoefficient,linearCoefficient,constantCoefficient,abscissa)=>{
           return(add(multiply(cubicCoefficient,cube(abscissa)), multiply(quadraticCoefficient,square(abscissa)), multiply(linearCoefficient,abscissa), constantCoefficient))
        },
        squareOrCubeHandler: (num,type) =>{
            if(type === "square") return square(num)
            else if(type === "cube") return cube(num)
        },
        evalFactorial: (a) => factorial(a),
        getMean: (args) => mean(args),
        getMedian: (args) => median(args),
        productHandler: (...args) => multiply(...args),
        differenceHandler: (a,b) =>  subtract(a,b),
        sumHandler: (a,b) =>  add(a,b),
        getDeterminant: (A) => det(A),
        getTranspose: (A) => transpose(A),
        getInverse: (A) => inv(A),
        getMaxElem: (A) => max(A),
        getMinElem: (A) => min(A),
        getTrace: (A) => trace(A),
        createDiagonalMatrix: (vect) => diag(vect),
        createIdentityMatrix: (n) => identity(n),
        createMatrix: (size, func) => matrixFromFunction(size, func),
        matrixNormHandler : (A,type) =>{
        if(type){
            return norm(A,type)
        }else{
            return  norm(A)
        }
        }, 
        dialogBox: (msg) =>{
            const dialog = document.querySelector("dialog");
            const closeButton = document.getElementById("close-dialog");
    
            dialog.style.transform = `translate(${(window.innerWidth/2) - 250}px, ${(window.innerHeight/2) - 100}px)`;
            dialog.querySelector('#msg').textContent = msg;
            closeButton.addEventListener("click", () => {
            dialog.close();
    });
    
            dialog.showModal();
        }
    });

    contextBridge.exposeInMainWorld('D3',{
        plot: (width,height,measuredData,smoothenedData,modeledData) =>{
            const x = d3.scaleLog([1,  d3.max(measuredData, d => d.x )], [20, width - 30]);
            const y = d3.scaleLog([d3.min(measuredData, d => d.y), d3.max(measuredData, d => d.y) + 50], [height - 21,10]);
            const svg = d3.select("svg");
            const ease = d3.easeExpOut

            //Bottom Axis Code
            const gxBottom = svg.append("g")
            gxBottom
            .attr("transform", `translate(-${width},${height-20})`)
            .transition()
            .attr("stroke-width", 3)
            .attr("font-weight", "bold")
            .attr("transform", `translate(12,${height-20})`)
            .duration(2050)
            .ease(ease)
            .call(d3.axisBottom(x).ticks(5));

            //Left Axis Code
            const gxLeftAxis = svg.append("g")
            gxLeftAxis
            .attr("transform", `translate(27,${height - 20})`)
            .transition()
            .attr("stroke-width", 3)
            .attr("font-weight", "bold")
            .attr("transform", `translate(27,0)`)
            .duration(2050)
            .delay(150)
            .ease(ease)
            .call(d3.axisLeft(y).ticks(5));

            //Scatter points Code
            svg.selectAll("circle")
           .data(measuredData)
           .enter()
           .append("circle")
           .attr("cx", d => x(d.x))
           .attr("cy", d => y(d.y))
           .attr("r", 3)
           .attr("fill","")
           .attr("stroke", "black");

           console.log('measured sucessfully rendered')
           //Curve Draw Code
           const line =  d3.line(d => x(d.x),d => y(d.y)).curve(d3.curveNatural);
           const modelPath = svg.append("path")
           .datum(modeledData)
           .attr("d", line)
           .attr("fill", "none")
           .attr("stroke", "red")
           .attr("stroke-width", 4);

        //    const smoothPath = svg.append("path")
        //    .datum(smoothenedData)
        //    .attr("d", line)
        //    .attr("fill", "none")
        //    .attr("stroke", "green")
        //    .attr("stroke-width", 4);
           
           const totalModelLength = modelPath.node().getTotalLength();
           const delay = 600 + ((measuredData.length - 1) * 10);
           modelPath
           .attr("stroke-dasharray", totalModelLength)
           .attr("stroke-dashoffset", totalModelLength)
           .transition()
           .duration(1200) 
           .delay(delay)
           .ease(d3.easePoly.exponent(2))
           .attr("stroke-dashoffset", 0);

           console.log('model sucessfully rendered')

        //    const totalSmoothLength = smoothPath.node().getTotalLength();
        //    smoothPath
        //    .attr("stroke-dasharray", totalSmoothLength)
        //    .attr("stroke-dashoffset", totalSmoothLength)
        //    .transition()
        //    .duration(1200) 
        //    .delay(delay)
        //    .ease(d3.easePoly.exponent(2))
        //    .attr("stroke-dashoffset", 0);

        },
        curveDraw: (measuredData,line,svg) =>{
            const path = svg.append("path")
            .datum(measuredData)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 3);
            
            const totalLength = path.node().getTotalLength();
            path
            .attr("stroke-dasharray", totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1500) 
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        }

        });

    contextBridge.exposeInMainWorld('gsapAnim',{
            to: (...args) => gsap.to(...args),
            from: (...args) => gsap.from(...args),
            fromTo: (...args) => gsap.fromTo(...args),
            set: (...args) => gsap.set(...args)
        });

})