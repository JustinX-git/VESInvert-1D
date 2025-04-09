// WENNER-SCHLUMBERGER MENU CODE
let arrayType;
const loadWS_Menu = (current, title) =>{
    if(current) current.classList.remove('reveal');
    document.querySelector('.wenner-schlumberger-menu').classList.add('reveal');
    document.querySelectorAll('.title')[0].textContent = title;
    current.querySelectorAll('.options .option').forEach(option =>{
        option.style.transform = 'translateY(50px)';
        option.style.opacity = 0
    });
    arrayType = title;
    // window.removeEventListener('keyup',handleKeyPress)
}

//The varaible name 'wS_Menu' had to be used here instead of WS_Menu because this functions runs in the scope of an object called 'WS_Menu', thus using that name anywhere within this function/method would throw a syntax error.
const WS_MenuEvents = (winres, mainMenu,gsapAnim, wS_Menu ,E_WS_Menu, X_WS_Menu) =>{
  const WS_Menu = document.querySelector(".wenner-schlumberger-menu");
  WS_Menu.querySelectorAll('.option').forEach(option =>{
    option.addEventListener('click', (e)=>{
        e.stopPropagation();
        switch (e.target.id) {
            case 'E':{
                E_WS_Menu.load(winres, WS_Menu, arrayType, wS_Menu);
            }     
                break;
            case 'R':{

            }     
                break;
            case 'X':{
                X_WS_Menu.load(winres, E_WS_Menu)
            }     
                break;
            case 'M':{

            }     
                break;
            case 'P':{

            }     
                break;
            case 'B':{

            }     
                break;
            case 'D':{

            }     
                break;

            default:{
              mainMenu.load(WS_Menu,gsapAnim)
            }
                break;
        }
    })
  })
};

export {loadWS_Menu,WS_MenuEvents};