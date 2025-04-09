// Initializes app intro
window.onload = ()=>{
    hideSvg(document.querySelectorAll("#circuit-svg > path"));
    hideSvg(document.querySelectorAll("#appTitle-svg  > path"));

    setTimeout(()=>{
        animateSVG(document.querySelectorAll("#circuit-svg  > path"),[2000],[0],["cubic-bezier(1,-0.03,.35,.81)"],"draw");
        animateSVG(Array.from(document.querySelectorAll("#appTitle-svg  > path")).reverse(),[2000,2000,2000,2000,1000,1000,1000,1000,1000,1000,1000],[0,0,0,0,1000,1000,1000,1000,1000,1000,1000],["cubic-bezier(1,-0.03,.35,.81)","cubic-bezier(1,-0.03,.35,.81)","cubic-bezier(1,-0.03,.35,.81)","cubic-bezier(1,-0.03,.35,.81)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)","cubic-bezier(.29,1.02,.6,.74)"],"draw");

        setTimeout(()=>{document.getElementById('appTitle-svg').classList.add('fill', 'filled')},2000)

        setTimeout(()=>{
            document.getElementById('appTitle-svg').classList.remove('fill');
            animateSVG(document.querySelectorAll("#circuit-svg  > path"),[1000],[800,1800,1300,1300,1300,1300,1500,1500,1500,1500,1500,1500,1500,1500,1500,1500,1200,1500,1300, 1300, 1500, 1500, 1300, 1500, 1500, 1200, 1400, 1400, 1200],["cubic-bezier(0.14, 0.08, 0, 1.02)"],"erase");
            animateSVG(document.querySelectorAll("#appTitle-svg  > path"),[1000],[2300,2200,1300,1300,1300,1300,1500,1500,1500,1500,1500],["cubic-bezier(0.14, 0.08, 0, 1.02)"],"erase");
            // main-menu
            setTimeout(() =>{
               document.querySelector('.appIntro-container').remove();
               document.getElementById('titleBar').classList.add('reveal');
               mainMenu.load(null,gsapAnim);
            },3000);

        },4000);

          },800)
}

// <---MODULES--->
mainMenu.attachEvents(winres,WS_Menu);
WS_Menu.attachEvents(winres,mainMenu,gsapAnim, WS_Menu, E_WS_Menu, X_WS_Menu);


// <--- UTILITY FUNCTIONS -->
//Hides an SVG by ofsetting its strokes by its path length.
function hideSvg(paths){
    paths.forEach(path =>{
     const pathLength = path.getTotalLength();
     path.style.strokeDasharray = `${pathLength}px`
     path.style.strokeDashoffset = `${pathLength}px`
    })
 }
 
 //Handles the animation of  SVG strokes. The 'animationType' parameter determines wether this animation should draw or erase the passed in SVG paths.
 function animateSVG(paths, durations, delays, eases, animationType){
    paths.forEach((path,index) =>{
     const finalValue = animationType === "draw" ? 0 : path.getTotalLength()
    path.animate({
    strokeDashoffset: `${finalValue}px`
     },{duration: durations.length > 1 ? durations[index] : durations[0], delay: delays.length > 1 ? delays[index] : delays[0], easing: eases.length > 1 ? eases[index] : eases[0], fill:"forwards"})
    })
 }
 