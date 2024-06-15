// password length 
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

// password display
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

// copy
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

// checkboxes
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

// indicator
const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={}[]|\:;"<,>.?/';

// DEFAULT VALUES
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");
handleSlider();


//FUNCTIONS

// function to set the slider
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber(){
    // return Math.floor(Math.random() * 9);
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shuffle(array){
    // fisher yates method
    for( let i = array.length - 1; i> 0 ; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// to count no of checkboxes checked
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount ++;
    });

    // speacial case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange());
})

//to change value of passwordlength when slider is moved
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// to copy when copy button is clicked and pass display is non empty
copyButton.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent(); 
    }
})

generateBtn.addEventListener('click', () => {
    // none of the checkboxes are selected
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider(); 
    }

    // to generate new password

    // remove old password
    password = "";

    // to write everycheckbox ticked atleast once

    // METHOD 1
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    // METHOD 2
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRndNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsary addition atleast once
    for(let i=0; i<funcArr.length ; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i=0; i<(passwordLength - funcArr.length); i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shuffle(Array.from(password));

    // display the password
    passwordDisplay.value = password;

    // cal strength
    calStrength();
    


})