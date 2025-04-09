//GLOBALS
let ArrayType, E_WS_Menu, WS_Menu, InputElems, Winres,PotentialDistanceChanged,
    PrevDistanceEntry = 0, BranchNo = 1,DataPoints = 0;
let InputArr = [],
    EditObj = {
      editMode: false,
      editedElem: null,
      editedBranch: null,
      editedBranchTable: null,
      isbranchLinkData: false 
    };
    //When 'MN' changes we repeat the last entered distance from our previous branch. Thus, the last distance entry of the previous branch and the first distance entry of the new branch would be the same. The 'isbranchLinkData' is a boolean that tells our app if the data being edited is either of the aforementioned distance entries. The check is necessary as the entries despite being in different branchess are 'linked' in that they have the same values, thus a change in one should reflect in the other.

//METHODS
const loadE_WS_Menu = (winres, current,arrayType, wS_Menu) =>{
  const menu_to_Load = document.querySelector('.E-wenner-schlumberger');
  const tableContainer = document.querySelector('.E-wenner-schlumberger .table-container');
  const midpoint = document.querySelectorAll('.midpoint');
  const p = document.querySelector('.E-wenner-schlumberger > p:nth-child(2)');
  const inputElems = menu_to_Load.querySelectorAll('input');

    if(current) current.classList.remove('reveal');
    menu_to_Load.classList.add('reveal');
    
    if(arrayType === 'Wenner Configuration'){
      p.style.display = 'none';
      midpoint.forEach(each => each.textContent = 'a');
      tableContainer.style.display = 'flex';
      tableContainer.style.justifyContent = 'center';
      tableContainer.querySelector('div').style.width = '40%';
      tableContainer.querySelector('div table').style.width = '100%';
      tableContainer.querySelector('div table').style.margin = 'auto 0';
    }else{
      p.style.display = 'block';
      midpoint.forEach(each => each.textContent = 'AB/2');
      tableContainer.style.display = 'grid';
      tableContainer.style.alignItems = 'start';
      tableContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
      tableContainer.querySelector('div').style.width = '100%'
      tableContainer.querySelector('div table').style.width = 'auto';
      tableContainer.querySelector('div table').style.margin = 'auto';
    };
    
    ArrayType = arrayType; E_WS_Menu = menu_to_Load; WS_Menu = wS_Menu; InputElems = inputElems;
    Winres = winres;
    window.addEventListener('keyup', handleKeyPress, true);

    inputElems.forEach(input =>{
     input.addEventListener('blur', inputEvents, true)
    })
}

// VALIDATIONS
const validateInput = (value, notProgressive) =>{
  if(Number.isNaN(Number(value)) || Number(value) < 0){
    Winres.dialogBox('Data must be a positive real number.');
    return false;
  }else if(Number(value) === 0){
    Winres.dialogBox('Data cannot be zero or empty.');
    return false;
  }else if(notProgressive && !EditObj.editMode){
    Winres.dialogBox('Distance data must not repeat nor be less than previous distance entries. A repitition is only permissible when \'MN\' changes.');
    return false;
  }else if(value.length > 30){
    Winres.dialogBox('Input exceeds maximum capacity');
    return false;
  }else{
      return true;
  }
}

const validateEdit = () =>{
  const editedElem = EditObj.editedElem;
  const editedBranch = EditObj.editedBranch;
  const editedBranchTable = EditObj.editedBranchTable;
  const branchFirstData =  editedBranchTable.children[1];
  const branchLastData =  editedBranchTable.lastElementChild;
  const previousElem = editedElem.previousElementSibling;
  const nextElem = editedElem.nextElementSibling;

     if(editedElem.dataset.point == branchFirstData.dataset.point){
          const editedBranchNo = editedBranchTable.dataset.branch;
          const editHasSiblingElements = editedBranchTable.childElementCount > 2 ? true : false;
      
          if(editedBranchNo == 1 && !editHasSiblingElements){ return true }
          else if(editedBranchNo == 1 && editHasSiblingElements){
             return (Number(InputArr[0]) < Number(nextElem.firstElementChild.textContent));
         }else if(editedBranchNo != 1 && !editHasSiblingElements){
            EditObj.isbranchLinkData = true;      
            const prevBranchSecondToLastDistanceData = editedBranch.previousElementSibling.lastElementChild.lastElementChild.previousElementSibling.firstElementChild.textContent;
            return (Number(InputArr[0]) > Number(prevBranchSecondToLastDistanceData));
         }else if(editedBranchNo != 1 && editHasSiblingElements){
           EditObj.isbranchLinkData = true;
           const prevBranchSecondToLastDistanceData = editedBranch.previousElementSibling.lastElementChild.lastElementChild.previousElementSibling.firstElementChild.textContent;
           return((Number(InputArr[0]) > Number(prevBranchSecondToLastDistanceData)) && (Number(InputArr[0]) < Number(nextElem.firstElementChild.textContent)))
         }

     } else if(editedElem.dataset.point == branchLastData.dataset.point){
       if(!editedBranch.nextElementSibling){
         return (Number(InputArr[0]) > Number(previousElem.firstElementChild.textContent));
        }else{
           EditObj.isbranchLinkData = true;
           const nextBranchSecondData = editedBranch.nextElementSibling.lastElementChild.children[2].firstElementChild.textContent || Number.POSITIVE_INFINITY;
           return((Number(InputArr[0]) > Number(previousElem.firstElementChild.textContent)) && (Number(InputArr[0]) <  Number(nextBranchSecondData)))
          }
     }
     else{
      return ((Number(InputArr[0]) < Number(nextElem.firstElementChild.textContent)) && (Number(InputArr[0]) > Number(previousElem.firstElementChild.textContent)) )
     }
}

//Gets the current table branch in preparation for a new branch
const fetchCurrentBranchTable = () =>{
   return Array.from(document.querySelectorAll('.E-wenner-schlumberger .table-container table')).filter(branch => branch.dataset.branch == BranchNo)[0];
}

//Appends validated inputs to the table for display
const appendInputDataToBranch = (currentBranch) =>{
  const tr = document.createElement('tr');
  tr.className = 'table-data';
  tr.setAttribute('data-point', ++DataPoints);
  tr.innerHTML = `
  <td class="distance-data">${InputArr[0].length < 20 ? InputArr[0] : Number(InputArr[0]).toExponential(2)}</td>
  <td class="resistivity-data">${InputArr[1].length < 20 ? Number(InputArr[1]).toFixed(2) : Number(InputArr[1]).toExponential(2)}</td>
  `;
  currentBranch.appendChild(tr);
  tr.addEventListener('click', tableRowClickHandler,true);
  InputElems[0].value = ''; InputElems[1].value = '';
  // JustSubmitted = true;
}

//EVENTS
const handleKeyPress = (e) =>{
  //Quit 'q' events
  if(e.key === 'q' && E_WS_Menu.classList.contains('reveal')){
    if(confirm('Are you sure you want to end the procedure!?...All progress would be lost.')){
      document.querySelectorAll('.E-wenner-schlumberger .table-container > div').forEach((div,index) =>{
        if(index === 0){
           div.querySelectorAll('table tr:not(:first-child)').forEach(data => data.remove());
           return;
        };
        div.remove();
      });
      BranchNo = 1;
      DataPoints = 0;
      PrevDistanceEntry = 0;
      PotentialDistanceChanged = false;
      window.removeEventListener('keyup', handleKeyPress);
      InputElems.forEach(input =>{
       input.value = '';
       input.disabled = false;
      //  input.removeEventListener('blur', inputEvents);
      })
      WS_Menu.load(E_WS_Menu, ArrayType)
    }else return;
  }

//Enter key events
  if((e.key === 'Enter' && E_WS_Menu.classList.contains('reveal'))){
    let notProgressive = true;

    InputElems.forEach((input, index) =>{
      InputArr[index] = (index === 0 && Number(input.value) !== 0) ? Number(input.value).toFixed(2) : input.value;
    });

      if(Number(InputArr[0]) > PrevDistanceEntry || PotentialDistanceChanged){notProgressive = false};    
      if(validateInput(InputArr[0], notProgressive) && validateInput(InputArr[1])){
          if(EditObj.editMode && validateEdit()){
             if(EditObj.isbranchLinkData && (EditObj.editedBranchTable.children[1] === EditObj.editedElem)){
               EditObj.editedBranch.previousElementSibling.lastElementChild.lastElementChild.firstElementChild.textContent = InputArr[0].length < 20 ? Number(InputArr[0]).toFixed(2) : Number(InputArr[0]).toExponential(2);
               EditObj.isbranchLinkData = false;
              }else if(EditObj.isbranchLinkData && (EditObj.editedBranchTable.lastElementChild === EditObj.editedElem)){
               EditObj.editedBranch.nextElementSibling.lastElementChild.children[1].firstElementChild.textContent = InputArr[0].length < 20 ? Number(InputArr[0]).toFixed(2) : Number(InputArr[0]).toExponential(2);
               EditObj.isbranchLinkData = false;
             }

            EditObj.editedElem.firstElementChild.textContent = InputArr[0].length < 20 ? Number(InputArr[0]).toFixed(2) : Number(InputArr[0]).toExponential(2);

            EditObj.editedElem.lastElementChild.textContent = InputArr[1].length < 20 ? Number(InputArr[1]).toFixed(2) : Number(InputArr[1]).toExponential(2);

            // JustSubmitted = true;
            EditObj.editMode = false;
            PrevDistanceEntry = Number(InputArr[0]);
            InputElems[0].value = ''; InputElems[1].value = '';
            return;
          }else if(EditObj.editMode){
            Winres.dialogBox('Edit failed because distance input violates the array configuration standards.');
            EditObj.editMode = false;
            InputElems[0].value = ''; InputElems[1].value = '';
            return;
          }

          if(InputElems[0].disabled) InputElems[0].disabled = false;
          PotentialDistanceChanged = false;
          PrevDistanceEntry = Number(InputArr[0]);
          const currentBranch = fetchCurrentBranchTable();
          appendInputDataToBranch(currentBranch);
    };
  }

  // 'C' key events
  if(e.key === 'c' && ArrayType === 'Schlumberger Configuration' && E_WS_Menu.classList.contains('reveal')){
     try {
      const currentBranchTable = fetchCurrentBranchTable();

      if(currentBranchTable.childElementCount < 3){
        throw new SyntaxError('Too few data points in current branch. Each branch should have at least two data points.')
      }
      const lastDistanceEntry = currentBranchTable.lastElementChild.querySelector('td:first-child').textContent;
      const div = document.createElement('div'); 
      
      PotentialDistanceChanged = true;
      InputElems[0].value = lastDistanceEntry;
      InputElems[0].disabled = true;
      div.id = `branch-${BranchNo + 1}`;
      div.className = 'branch';
      div.innerHTML = `
      <p>Branch ${BranchNo + 1}</p>
      <table data-branch="${BranchNo + 1}">
          <tr data-point="${DataPoints}">
         <th>Distance(AB/2) [m]</th>
         <th>Resistivity [Ωm]</th>
       </tr>
      
      </table>       
      `;
      BranchNo = BranchNo + 1;
      document.querySelector('.table-container').appendChild(div)
     } catch (error) {
          if( error instanceof TypeError){
             Winres.dialogBox('Cannot add new branch when current branch has no data.')
         } else if(error instanceof SyntaxError){
             Winres.dialogBox(error.message)

     }
  }
}

// 'R' key events
  if(e.key === 'r' && E_WS_Menu.classList.contains('reveal')){
   try {
    const table = fetchCurrentBranchTable();
    const lastRow = table.lastElementChild;
    const lastRowData = lastRow.querySelectorAll('td')
    InputElems[0].value = lastRowData[0].textContent;
    InputElems[1].value = lastRowData[1].textContent;
    
    EditObj.editMode = true;
    EditObj.editedElem = lastRow;
    EditObj.editedBranchTable = table;
    EditObj.editedBranch = table.parentElement;
 
   } catch (error) {
    if( error instanceof TypeError)
    Winres.dialogBox('There is no branch data to renew.');
}
}

// 'P' key events
if(e.key === 'p' && E_WS_Menu.classList.contains('reveal')){ 
  if(E_WS_Menu.querySelector('td')){
    let isPlotWinOpen = false;
    Winres.isPlotWinOpen()
    .then((isPlotWinOpen)=>{
        if(isPlotWinOpen){
          
        }else{
         const distances =  Array.from(E_WS_Menu.querySelectorAll('td:first-child')).map(data => Number(data.textContent));
         const resistivities = Array.from(E_WS_Menu.querySelectorAll('td:last-child')).map(data => Number(data.textContent));
         const dataPoints = {
           distances,
           resistivities,
           arrayType: ArrayType
          };       
          Winres.plot(dataPoints);
          const dialog = document.querySelectorAll("dialog")[1];
          dialog.style.transform = `translate(${(window.innerWidth/2) - 250}px, ${(window.innerHeight/2) - 100}px)`;
          document.querySelector(':root').style.setProperty('--progress-bar-width', '0%');
          dialog.showModal(); 
       }
    })
      Winres.setupPlotWin();  
  }else{
       Winres.dialogBox('No data to plot.');
     }
  }
}

const tableRowClickHandler = (e) =>{
  const editRow = e.target.parentElement;
  InputElems[0].value = editRow.children[0].textContent;
  InputElems[1].value = editRow.children[1].textContent;

  EditObj.editMode = true;
  EditObj.editedElem = editRow;
  EditObj.editedBranchTable = editRow.parentElement;
  EditObj.editedBranch = editRow.parentElement.parentElement;
}

const inputEvents = (e) =>{
  return;
  // if(JustSubmitted){
  //   JustSubmitted = false;
  //   return;
  // };

  // const inputIndexToDisable = e.target.id === 'WS-distance' ? 1 : 0;
  // const isValidInput = validateInput(e.target.value);
  // if(!isValidInput){
  //   e.target.value = ''
  //   InputElems[inputIndexToDisable].disabled = true;
  // }else if(!PotentialDistanceChanged){
  //   InputElems[inputIndexToDisable].disabled = false;
  // }
}


export {loadE_WS_Menu}