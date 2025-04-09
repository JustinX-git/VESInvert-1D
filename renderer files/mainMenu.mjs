//MAIN MENU CODE
const loadMainMenu = (current, gsapAnim)=>{
    if(current) current.classList.remove('reveal');
    document.querySelector('.main-menu').classList.add('reveal');
    gsapAnim.to('.main-menu .option', {y:'0px', opacity: 1, duration:.2, stagger:.1, ease: 'power3.out'});
}

const mainMenuEvents = (winres, WS_Menu)=>{
    const mainMenu =  document.querySelector('.main-menu');
    mainMenu.querySelectorAll('.options .option').forEach(option =>{
    option.addEventListener('mouseover', (e)=>{
        e.stopPropagation();
        e.target.style.scale = 1.02;
        e.target.style.borderColor = '#d9d9d9dc'
    });

    option.addEventListener('mouseout', (e)=>{
        e.stopPropagation();
        e.target.style.scale = 1;
        e.target.style.borderColor = '#d9d9d962'
    })

    option.addEventListener('click', (e)=>{
        e.stopPropagation();
        switch (e.target.dataset.control) {
            case 'Wenner Configuration':{
                WS_Menu.load(mainMenu, e.target.dataset.control)
            }
            
            break;
            case 'Schlumberger Configuration':
                WS_Menu.load(mainMenu, e.target.dataset.control)
                break;
            case 'Dipole Dipole Configuration':
                
                break;
            case 'Quit':
                winres.quit()
                break;
        
            default:
                break;
        }
    })
})
};

export {loadMainMenu, mainMenuEvents}
