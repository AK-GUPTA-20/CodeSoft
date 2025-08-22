const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentInput = "0";
let previousInput = "";
let operator = "";
let shouldResetDisplay = false;
let justCalculated = false;
let showingOperator = false;

function updateDisplay() {
  // Format large numbers and limit decimal places
  let displayValue = currentInput;
  
  // Show the operator when it's selected
  if (showingOperator && operator && previousInput) {
    displayValue = previousInput + " " + operator;
  }
  
  if (!isNaN(displayValue) && displayValue.toString().length > 12) {
    displayValue = parseFloat(displayValue).toExponential(6);
  }
  
  display.textContent = displayValue;
}

function formatExpression(expr) {
  return expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/%/g, "/100");
}

function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  
  switch(op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": 
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    case "%": return a % b;
    default: return b;
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (button.classList.contains("number")) {
      if (currentInput === "0" || shouldResetDisplay || justCalculated) {
        currentInput = value;
        shouldResetDisplay = false;
        justCalculated = false;
        showingOperator = false;
      } else {
        // Prevent multiple decimal points
        if (value === "." && currentInput.includes(".")) return;
        currentInput += value;
        showingOperator = false;
      }
    } 
    
    else if (button.classList.contains("operator")) {
      if (justCalculated) {
        justCalculated = false;
      }
      
      if (previousInput !== "" && operator !== "" && !shouldResetDisplay && !showingOperator) {
        try {
          const result = calculate(previousInput, operator, currentInput);
          currentInput = result.toString();
          updateDisplay();
        } catch (error) {
          currentInput = "Error";
          updateDisplay();
          return;
        }
      }
      
      previousInput = currentInput;
      operator = value;
      shouldResetDisplay = true;
      showingOperator = true;
    } 
    
    else if (button.classList.contains("equal")) {
      if (previousInput !== "" && operator !== "") {
        try {
          const result = calculate(previousInput, operator, currentInput);
          currentInput = result.toString();
          previousInput = "";
          operator = "";
          justCalculated = true;
          showingOperator = false;
        } catch (error) {
          currentInput = "Error";
        }
        shouldResetDisplay = true;
      }
    } 
    
    else if (button.classList.contains("clear")) {
      currentInput = "0";
      previousInput = "";
      operator = "";
      shouldResetDisplay = false;
      justCalculated = false;
      showingOperator = false;
    }
    
    else if (button.classList.contains("clear-entry")) {
      currentInput = "0";
      shouldResetDisplay = false;
      showingOperator = false;
    }

    updateDisplay();
  });
});

// Enhanced keyboard support
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  
  if (!isNaN(e.key) || e.key === ".") {
    if (currentInput === "0" || shouldResetDisplay || justCalculated) {
      currentInput = e.key;
      shouldResetDisplay = false;
      justCalculated = false;
      showingOperator = false;
    } else {
      if (e.key === "." && currentInput.includes(".")) return;
      currentInput += e.key;
      showingOperator = false;
    }
  } 
  
  else if (["+", "-", "*", "/", "%"].includes(e.key)) {
    if (justCalculated) {
      justCalculated = false;
    }
    
    if (previousInput !== "" && operator !== "" && !shouldResetDisplay && !showingOperator) {
      try {
        const result = calculate(previousInput, operator, currentInput);
        currentInput = result.toString();
        updateDisplay();
      } catch (error) {
        currentInput = "Error";
        updateDisplay();
        return;
      }
    }
    
    let op = e.key;
    if (op === "*") op = "×";
    if (op === "/") op = "÷";
    if (op === "-") op = "−";
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    showingOperator = true;
  } 
  
  else if (e.key === "Enter" || e.key === "=") {
    if (previousInput !== "" && operator !== "") {
      try {
        const result = calculate(previousInput, operator, currentInput);
        currentInput = result.toString();
        previousInput = "";
        operator = "";
        justCalculated = true;
        showingOperator = false;
      } catch (error) {
        currentInput = "Error";
      }
      shouldResetDisplay = true;
    }
  } 
  
  else if (e.key === "Backspace") {
    if (currentInput.length > 1 && currentInput !== "Error") {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = "0";
    }
    shouldResetDisplay = false;
    justCalculated = false;
    showingOperator = false;
  } 
  
  else if (e.key.toLowerCase() === "c" || e.key === "Escape") {
    currentInput = "0";
    previousInput = "";
    operator = "";
    shouldResetDisplay = false;
    justCalculated = false;
    showingOperator = false;
  }
  
  else if (e.key === "Delete") {
    currentInput = "0";
    shouldResetDisplay = false;
    showingOperator = false;
  }
  
  updateDisplay();
});

// Initialize display
updateDisplay();