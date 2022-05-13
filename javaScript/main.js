// *********************matrix or function************************
// *****************************************************************

const matrixBtn = document.getElementById("toMatrix");
matrixBtn.addEventListener("click", () => {
  if (matrixBtn.textContent === "Matrix") {
    matrixBtn.textContent = "Function";
    document.getElementById("fMode").classList.add("display-none");
    document.getElementById("matrixMode").classList.remove("display-none");
  } else {
    matrixBtn.textContent = "Matrix";
    document.getElementById("fMode").classList.remove("display-none");
    document.getElementById("matrixMode").classList.add("display-none");
  }
});

// *********************Function Input UI************************
// *******************************************************
const methodsForm = document.getElementById("methodsForm");

// Condition Iterations or error
let conditionValue = document.getElementById("conditionValue");
let conditionSelect = document.getElementById("condition");
conditionSelect.addEventListener("change", () => {
  if (conditionSelect.value === "iter") {
    //   iterations input
    conditionValue.innerHTML = `
    <input type="number" id="iter" name="iter" required />
    <span></span>
    <label for="iter">Max Iterations</label>`;
  } else {
    //   error input
    conditionValue.innerHTML = `
    <input type="number" step="any"  id="err" name="err" required />
    <span></span>
    <label for="err">Error Target</label>`;
  }
});

// Solving Methods
let methodFirstInput = document.querySelectorAll(
  ".methods-inputs .input-container"
)[0];
let methodSecondInput = document.querySelectorAll(
  ".methods-inputs .input-container"
)[1];

let methodSelect = document.getElementById("method");

methodSelect.addEventListener("change", () => {
  if (methodSelect.value === "bi" || methodSelect.value === "false") {
    methodFirstInput.innerHTML = `
    <input type="number" step="any" id="xl" name="xl" required />
    <span></span>
    <label for="xl">X Lower</label>`;
    methodSecondInput.innerHTML = `
    <input type="number" step="any" id="xu" name="xu" required />
    <span></span>
    <label for="xu">X Upper</label>`;
  } else if (
    methodSelect.value === "simple" ||
    methodSelect.value === "newton"
  ) {
    methodFirstInput.innerHTML = `
    <input type="number" step="any" id="xo" name="xo" required />
    <span></span>
    <label for="xo">Random Initial Value</label>`;
    methodSecondInput.innerHTML = "";
  } else {
    methodFirstInput.innerHTML = `
    <input type="number" step="any" id="xminus1" name="xminus1" required />
    <span></span>
    <label for="xminus1">X - 1</label>`;
    methodSecondInput.innerHTML = `
    <input type="number" step="any" id="xo" name="xo" required />
    <span></span>
    <label for="xo">Random Initial Value</label>`;
  }
});

// *********************End Input UI************************
