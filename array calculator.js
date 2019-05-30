//array calculator

//converting Number to Array of Integers. null is decimal point

let num1 = '23';
let num2 = '-3.11325';
let operator1 = 'multiply';

function main(numString1, numString2, operator) {
  let equation = createEquation(numString1, numString2, operator);
  let convertedEquation = convertEquation(equation);
  let solution = solve(convertedEquation);
  let stringSolution = convertSolution(solution)
  return stringSolution
}

function createEquation (numString1, numString2, operator1) {
  let num1Positive = true;
  let num2Positive = true;
  if (numString1.charAt(0) === '-') {
    numString1 = numString1.slice(1);
    num1Positive = false
  }
  if (numString2.charAt(0) === '-') {
    numString2 = numString2.slice(1);
    num2Positive = false
  }
  
  let equation = {
    //op = operand
    op1: numStringToSplitArrays(numString1),
    op2: numStringToSplitArrays(numString2),
    operator: operator1,
    op1Pos : num1Positive,
    op2Pos : num2Positive,
    //defaults to positive, can be changed later
    isSolutionPos : true
  }
  
  
  return equation
}

// for adding and subtracting, equation may need converting to account for positive/negative.
// ex. 2 - 5 is calculated as 5 - 2, with sign switch. ex. 5 - (-2) is calculated as 5 + 2
function convertEquation(equation) {
  let convertedEquation = {}
  
  if (equation.operator === 'add') {
    // 5 + 2
    if (equation.op1Pos && equation.op2Pos) {
      convertedEquation = equation
    }  
    // 5 + (-2) => 5 - 2
    if (equation.op1Pos && !equation.op2Pos && isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = true;
    }
    // 5 + (-8) => 8 - 5, solution sign neg
    if (equation.op1Pos && !equation.op2Pos && !isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op2;
      convertedEquation.op2 = equation.op1;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = false;
    }
    // -2 + 5 => 5 - 2
    if (!equation.op1Pos && equation.op2Pos && !isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op2;
      convertedEquation.op2 = equation.op1;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = true;
    }
    // -2 + 1 => 2 - 1, sign neg
    if (!equation.op1Pos && equation.op2Pos && isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = false;
    }
    // -2 + (-3) => 2 + 3, sign neg
    if (!equation.op1Pos && !equation.op2Pos ) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'add';
      convertedEquation.isSolutionPos = false;
    }
  }
  
  if (equation.operator === 'subtract') {
    // 5 - 2
    if (equation.op1Pos && equation.op2Pos && isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = true;
    }
    // 2 - 5 => 5 - 2, sign neg
    if (!equation.op1Pos && equation.op2Pos && isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op2;
      convertedEquation.op2 = equation.op1;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = false;
    }
    // 5 - (-2) => 5 + 2
    if (equation.op1Pos && !equation.op2Pos ) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'add';
      convertedEquation.isSolutionPos = true;
    }
    // -5 - 2 => 5 + 2, sign neg
    if (!equation.op1Pos && equation.op2Pos ) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'add';
      convertedEquation.isSolutionPos = false;
    }
    // -5 - (-2) => 5 - 2, neg
    if (!equation.op1Pos && !equation.op2Pos && isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = false;
    }
    // -5 - (-8) => 8 - 5, pos
    if (!equation.op1Pos && !equation.op2Pos && !isFirstArrayGreater(equation.op1, equation.op2)) {
      convertedEquation.op1 = equation.op2;
      convertedEquation.op2 = equation.op1;
      convertedEquation.operator = 'subtract';
      convertedEquation.isSolutionPos = true;
    }
  }

  if (equation.operator === 'multiply') {
    convertedEquation.operator = equation.operator;
    if( (equation.op1Pos && equation.op2Pos) ||
       (!equation.op1Pos && !equation.op2Pos) ) {
        convertedEquation.isSolutionPos = true
    } else {
      convertedEquation.isSolutionPos = false
    }
    //aligns equation by significant digits, op1 will be same or greater number of significant digits
    if (equation.op1[0].length + equation.op1[1].length >=
        equation.op2[0].length + equation.op2[1].length ) {
      convertedEquation.op1 = equation.op1;
      convertedEquation.op2 = equation.op2;
    } else {
      convertedEquation.op1 = equation.op2;
      convertedEquation.op2 = equation.op1;
      
    }
  }
  
return convertedEquation
}

//given 2 equal length arrays of non-negative integers
function isFirstArrayGreater(arr1, arr2) {
  let flatArr1 = arr1[0].concat(arr1[1]);
  let flatArr2 = arr2[0].concat(arr2[1]);
  for (let i = 0; i < flatArr1.length; i++) {
    if (flatArr1[i] > flatArr2[i]) {
      return true
    }
    if (flatArr1[i] < flatArr2[i]) {
      return false
    }
  }
  return false
  
  
}


function numStringToSplitArrays(numString) {
  let arr1 = NumberStringToArray(numString);
  return splitArraysOnDecimal(arr1)
}


//converts number to an array of integers, with decimal point represented by undefined
function NumberStringToArray(numString) {
  let strArray = numString.split('');
  
  for (let x = 0; x < strArray.length; x++) {
    if (strArray[x] === '.') {
      strArray[x] = undefined;
    } else {
      strArray[x] = parseInt(strArray[x])
    }
  }
  return strArray
}


function solve(equation) {
  if (equation.operator === 'add') {
    var paddedObj = padOperands(equation);
    var solved = add(paddedObj.op1, paddedObj.op2, equation.isSolutionPos)
  }
  
  if (equation.operator === 'subtract') {
    var paddedObj = padOperands(equation);
    var solved =subtract(paddedObj.op1, paddedObj.op2, equation.isSolutionPos)
  }
  
  if (equation.operator === 'multiply') {
    var solved = multiply(equation.op1, equation.op2, equation.isSolutionPos)
  }
  return solved
}

function subtract(arr1, arr2, solPos) {
  //solution contains array of [equation, solution, boolean that is true/false if solution is positive/negative]
  let solution = [[],[],[solPos]];
  let carry = 0;
  for (let x = arr1[1].length - 1; x > -1; x--) {
    let difference = arr1[1][x] - arr2[1][x] - carry;
    carry = 0;
    if (difference > -1) {
      solution[1].unshift(difference)
    } else {
      solution[1].unshift(difference + 10);
      carry = 1;
    }
  }

  for (let x = arr1[0].length - 1; x > -1; x--) {
    let difference = arr1[0][x] - arr2[0][x] - carry;
    carry = 0;
    if (difference > -1) {
      solution[0].unshift(difference)
    } else {
      solution[0].unshift(difference + 10);
      carry = 1;
    }
  }
  return solution
}



//adds equal sized array of arrays
function add(arr1, arr2, solPos) {
  //solution will contain whole numbers, decimals, and boolean that's true if sign is positive
  let solution = [[],[],[solPos]];
  let carry = 0;
  //adds up decimal elements, starting from last decimal place
  for (let x = arr1[1].length - 1; x > -1; x--) {
    let sum = arr1[1][x] + arr2[1][x] + carry;
    carry = 0;
    if (sum < 10) {
      solution[1].unshift(sum)
    } else {
      solution[1].unshift(sum % 10);
      carry = 1;
    }
  }
  //adds up whole number elements, starting from last decimal place
  for (let i = arr1[0].length - 1; i > -1; i--) {
    // carries over carry from decimals, if any
    let sum = arr1[0][i] + arr2[0][i] + carry;
    carry = 0;
    if (sum < 10) {
      solution[0].unshift(sum)
    } else {
      solution[0].unshift(sum % 10);
      carry = 1;
    }
  }
  if (carry === 1) {
    solution[0].unshift(1)
  }
  
  
  return solution
}

function multiply(arr1, arr2, solPos) {
  let decimals = arr1[1].length + arr2[1].length;
  let flatnum1 = arr1[0].concat(arr1[1]);
  let flatnum2 = arr2[0].concat(arr2[1]);
  let multArray = [];
  //add empty array for every significant digit in shorter number. 100 x 21 = >
  //   100
  //  x 21
  //  ____
  //   100
  //  2000  two lines for addition => multArray =>[[],[]]
  for (let i = 0; i < flatnum2.length; i++) {
    multArray.push([]);
  }
  // add zeroes in answer
  // ___ 
  //   
  //   0
  //  00  => [[],[0],[0,0]]
  for (let i = 1; i < flatnum2.length; i++) {
    
    for (let j = 0; j < i ; j++ ) {
      multArray[i].push(0)
    }
  }     
  
  multArray.reverse();
  //multiplies each line of equation
  for (let i = flatnum2.length - 1; i > -1 ; i--) {
    let carry = 0;
  
    for (let k = flatnum1.length - 1; k > -1; k--) {
      
      let prod = flatnum2[i] * flatnum1[k] + carry;
      carry = 0;
      multArray[i].unshift(prod % 10);
      if (prod > 9) {
        carry = Math.floor(prod/10)
      }
    }
    if (carry > 0) {
      multArray[i].unshift(carry)
    }
  }  
  let product = sumArrays(multArray);
  
  return [/*flatnum1, flatnum2, multArray,*/ product, solPos, decimals]
  
}

//adds multiple arrays of integers of varying lengths
function sumArrays(rowArray) {
  //this will be the "accumulator" array
  let solutionArray = [rowArray[rowArray.length - 1]][0];
  // ex.  2 x 3, no row addition needed
  if (rowArray.length === 1) {
    return solutionArray
  }
  // starting with the second to last row, adds each row to "accumulator" array
  for (let i = rowArray.length - 2; i > -1; i-- ) {
    let tempSolutionArray = [];
    let digitDifference = solutionArray.length - rowArray[i].length;
    //pads arrays with zeroes to make them equal length
    if (digitDifference > 0) {
      for (let j = 0; j < digitDifference; j++) {
        rowArray[i].unshift(0)
      }
    } else {
      if (digitDifference < 0 ) {
        for (let j = 0; j < -1 * digitDifference; j++) {
          solutionArray.unshift(0)
        }  
      }
    }
    let carry = 0;
    for (let k = rowArray[i].length - 1; k > -1; k--) {
      let sum = rowArray[i][k] + solutionArray[k] + carry
      carry = 0;
      if (sum < 10) {
        tempSolutionArray.unshift(sum)
      } else {
        tempSolutionArray.unshift(sum % 10);
        carry = 1;
      }
    }
    if (carry === 1) {
      tempSolutionArray.unshift(1)
    }
    solutionArray = tempSolutionArray;

  }
  
  return solutionArray


}



//create equal sized element arrays on both sides of decimal representing both operands
function padOperands(Obj) {
  let intDiff = (Obj.op1[0].length - Obj.op2[0].length)
  let decDiff = (Obj.op1[1].length - Obj.op2[1].length)
  //number is has same number of digits on both sides of decimal
  if (intDiff === 0 && decDiff === 0) {
    return Obj
  } 
  
  if (intDiff > 0) {
    for (let x = 0; x < intDiff; x++) {
      Obj.op2[0].unshift(0)
    }
  }
  
  if (intDiff < 0) {
    for (let x = intDiff; x < 0 ; x++) {
      Obj.op1[0].unshift(0)
    }
  }

  if (decDiff > 0) {
    for (let x = 0; x < decDiff; x++) {
      Obj.op2[1].push(0)
    }
  }
  
  if (decDiff < 0) {
    for (let x = decDiff; x < 0 ; x++) {
      Obj.op1[1].push(0)
    }
  }
  return Obj
  
  
}

function splitArraysOnDecimal(arr) {
  let decimalIndex = arr.indexOf(undefined);
  let intArray = [];
  if (decimalIndex !== -1) {
    //splits array into 2 arrays, split on the decimal point
    intArray = arr.splice(0, decimalIndex);
    //get rid of decimal point, which is represented by undefined
    arr.shift();
    // array represent a float 23.5 => [[2, 3],[5]]
    return [intArray, arr]
  } else {
    //array represent an integer 235 => [[2,3,5],[]]
    return [arr, []]
  }
  
}

function convertSolution(solution) {
  let stringSolution = '';
  if (solution[2] !== 0) {
    solution[0].splice(-1 * solution[2], 0, '.')
  }
  
  console.log(solution)
  let stringArray = [];
  for (i = 0; i < solution[0].length; i++) {
    stringSolution += solution[0][i].toString()
    
  }
  if (!solution[1]) {
    stringSolution = '-' + stringSolution
  }
  return stringSolution
}

output = JSON.stringify(main(num1, num2, operator1));
console.log(output)
