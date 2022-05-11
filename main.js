// *********************Login/createAccount************************
// *****************************************************************
const profile = document.getElementById("profile-icon");
profile.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".login-container").classList.remove("display-none");
  document.querySelector(".cover").classList.remove("display-none");
});

const xLogin = document.getElementById("login-container-x-mark");
xLogin.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".login-container").classList.add("display-none");
  document.querySelector(".cover").classList.add("display-none");
});

const loginForm = document.getElementById("login");
const createAccountForm = document.getElementById("createAccount");
const createAccountLink = document.getElementById("linkCreateAccount");
createAccountLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("display-none");
  createAccountForm.classList.remove("display-none");
});
const loginLink = document.getElementById("linkLogin");
loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("display-none");
  createAccountForm.classList.add("display-none");
});

function setFormMsg(formElement, type, message) {
  const msgElement = formElement.querySelector(".form-msg");

  msgElement.textContent = message;
  msgElement.classList.remove("form-msg-error", "form-msg-success");
  msgElement.classList.add(`form-msg-${type}`);
}

setFormMsg(loginForm, "success", "Your are logged in!");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  setFormMsg(loginForm, "error", "Invalid username/password combination.");
});

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

// *********************Input UI************************
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

// Method
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

// *********************Calculations*********************
// *******************************************************
let solutionSection = document.querySelector(".solution");
methodsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  solutionSection.classList.remove("display-none");
  document.getElementById("root").scrollIntoView({ behavior: "smooth" });
  let condition = conditionSelect.value;

  let i = 0;
  let eps = 0;
  if (condition === "iter") i = document.getElementById("iter").value;
  else eps = document.getElementById("err").value;

  let method = methodSelect.value;
  switch (method) {
    case "bi":
      let xl = document.getElementById("xl").value;
      let xu = document.getElementById("xu").value;
      bisection(xl, xu, i, eps);
      break;
    case "false":
      let fxl = document.getElementById("xl").value;
      let fxu = document.getElementById("xu").value;
      falsePosition(fxl, fxu, i, eps);
      break;
    case "simple":
      let simpleXo = document.getElementById("xo").value;
      simpleFixedPoint(simpleXo, i, eps);
      break;
    case "newton":
      let xo = document.getElementById("xo").value;
      newton(xo, i, eps);
      break;
    case "secant":
      let xminus1 = document.getElementById("xminus1").value;
      let sxo = document.getElementById("xo").value;
      secant(xminus1, sxo, i, eps);
      break;
  }
});

//Calculate function from user
function f(n) {
  let fx = document.getElementById("fx").value;
  let fn = fx.replace(/(\d+)x/gi, "$1*" + n);
  fn = fn.replace(/x/gi, n);
  return math.evaluate(fn);
}

function fDash(n) {
  let fx = document.getElementById("fx").value;
  let fDashX = math.derivative(fx, "x").toString();
  let fn = fDashX.replace(/(\d+)x/gi, "$1*" + n);
  fn = fDashX.replace(/x/gi, n);
  return math.evaluate(fn);
}

// *********************Methods Functions************************
let tableHeadRow = document.querySelector(".solution table thead tr");
let tableBody = document.querySelector(".solution table tbody");
let tableFoot = document.querySelector(".solution table tfoot");

function bisection(xl, xu, iter, eps) {
  clearTable();
  displayTableHead("i", "xl", "f(xl)", "xu", "f(xu)", "xr", "f(xr)", "err");
  if (f(xl) * f(xu) >= 0) return "function has no solution.";

  let xr = 0;
  let i = 1;
  let xrold = 0;
  let err = 100;
  let errorDisplay = "";

  while (iter === 0 ? err > eps : i <= iter) {
    xrold = xr;
    xr = Number(((xl + xu) / 2).toFixed(3));
    err = Number((Math.abs((xr - xrold) / xr) * 100).toFixed(3));

    //Displaying Each iteration
    if (i === 1) errorDisplay = "-";
    else errorDisplay = err;
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${i}</td>
    <td>${xl}</td>
    <td>${f(xl).toFixed(3)}</td>
    <td>${xu}</td>
    <td>${f(xu).toFixed(3)}</td>
    <td>${xr}</td>
    <td>${f(xu).toFixed(3)}</td>
    <td>${errorDisplay}</td>`;

    if (f(xl) * f(xr) < 0) xu = xr;
    else if (f(xl) * f(xr) > 0) xl = xr;
    else break;

    tableBody.appendChild(row);
    i++;
  }
  displayRoot(xr);
}

function falsePosition(xl, xu, iter, eps) {
  clearTable();
  displayTableHead("i", "xl", "f(xl)", "xu", "f(xu)", "xr", "f(xr)", "err");
  if (f(xl) * f(xu) >= 0) return "function has no solution.";

  let xr = 0;
  let i = 1;
  let xrold = 0;
  let err = 100;
  let errorDisplay = "";
  while (iter === 0 ? err > eps : i <= iter) {
    xrold = xr;
    xr = Number((xu - (f(xu) * (xl - xu)) / (f(xl) - f(xu))).toFixed(3));
    err = Number((Math.abs((xr - xrold) / xr) * 100).toFixed(3));

    //Displaying Each iteration
    if (i === 1) errorDisplay = "-";
    else errorDisplay = err;
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${i}</td>
    <td>${xl}</td>
    <td>${f(xl).toFixed(3)}</td>
    <td>${xu}</td>
    <td>${f(xu).toFixed(3)}</td>
    <td>${xr}</td>
    <td>${f(xu).toFixed(3)}</td>
    <td>${errorDisplay}</td>`;

    if (f(xl) * f(xr) < 0) xu = xr;
    else if (f(xl) * f(xr) > 0) xl = xr;
    else break;

    tableBody.appendChild(row);
    i++;
  }
  displayRoot(xr);
}

function simpleFixedPoint(xo, iter, eps) {
  clearTable();
  displayTableHead("i", "xi", "f(xi)", "err");

  let xi = 0;
  let i = 0;
  let xrold = 0;
  let err = 100;
  let errorDisplay = "";
  while (iter === 0 ? err > eps : i <= iter - 1) {
    xi = xo;
    err = (Math.abs((xi - xrold) / xi) * 100).toFixed(3);

    //Displaying Each iteration
    if (i === 0) errorDisplay = "-";
    else errorDisplay = err;
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${i}</td>
    <td>${xi}</td>
    <td>${f(xi).toFixed(3)}</td>
    <td>${errorDisplay}</td>`;

    tableBody.appendChild(row);
    xo = f(xi).toFixed(3);
    xrold = xi;
    i++;
  }
  displayRoot(xi);
}

function newton(xo, iter, eps) {
  clearTable();
  displayTableHead("i", "xi", "f(xi)", "fDash(xi)", "err");

  let xi = 0;
  let i = 0;
  let xrold = 0;
  let err = 100;
  let errorDisplay = "";
  while (iter === 0 ? err > eps : i <= iter - 1) {
    xi = xo;
    err = (Math.abs((xi - xrold) / xi) * 100).toFixed(3);

    //Displaying Each iteration
    if (i === 0) errorDisplay = "-";
    else errorDisplay = err;
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${i}</td>
    <td>${xi}</td>
    <td>${f(xi).toFixed(3)}</td>
    <td>${fDash(xi).toFixed(3)}</td>
    <td>${errorDisplay}</td>`;

    tableBody.appendChild(row);
    xo = (xi - f(xi) / fDash(xi)).toFixed(3);
    xrold = xi;
    i++;
  }
  displayRoot(xi);
}

function secant(xminus1, xo, iter, eps) {
  clearTable();
  displayTableHead("i", "xi-1", "f(xi-1)", "xi", "f(xi)", "err");

  let xi = 0;
  let i = 0;
  let err = 100;
  let errorDisplay = "";
  while (iter === 0 ? err > eps : i <= iter - 1) {
    xi = xo;
    err = (Math.abs((xi - xminus1) / xi) * 100).toFixed(3);

    //Displaying Each iteration
    if (i === 0) errorDisplay = "-";
    else errorDisplay = err;
    let row = document.createElement("tr");
    row.innerHTML = `
    <td>${i}</td>
    <td>${xminus1}</td>
    <td>${f(xminus1).toFixed(3)}</td>
    <td>${xi}</td>
    <td>${f(xi).toFixed(3)}</td>
    <td>${errorDisplay}</td>`;

    tableBody.appendChild(row);
    xo = (xi - (f(xi) * (xminus1 - xi)) / (f(xminus1) - f(xi))).toFixed(3);
    xminus1 = xi;
    i++;
  }
  displayRoot(xi);
}

// *********************table Display Function************************
function clearTable() {
  tableHeadRow.innerHTML = "";
  tableBody.innerHTML = " ";
}

function displayTableHead(...heads) {
  for (let i = 0; i < heads.length; i++) {
    let tableCell = document.createElement("td");
    tableCell.textContent = `${heads[i]}`;
    tableHeadRow.append(tableCell);
  }
}

function displayRoot(x) {
  let root = document.getElementById("root");
  root.textContent = `Root = ${x}`;
}

// *********************Matrix************************

// Matrix Values
const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
let matrixRows = 0;
let matrixCols = 0;
rowsInput.addEventListener("change", () => {
  matrixRows = rowsInput.value < 6 && rowsInput.value > 1 ? rowsInput.value : 0;
  if (matrixCols !== 0) addMatrixInputs(matrixRows, matrixCols);
});
colsInput.addEventListener("change", () => {
  matrixCols = colsInput.value < 6 && colsInput.value > 1 ? colsInput.value : 0;
  if (matrixRows !== 0) addMatrixInputs(matrixRows, matrixCols);
});

function addMatrixInputs(rows, cols) {
  let matrixInputs = document.querySelector(".matrix-values");
  matrixInputs.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  matrixInputs.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  matrixInputs.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let input = document.createElement("div");
      input.setAttribute("class", "input-container");
      if (j !== cols - 1) {
        input.innerHTML = `
        <input type="number" id="x${i + 1}${j + 1}" name="x${i + 1}${
          j + 1
        }" required />
        <span></span>
        <label for="x${i + 1}${j + 1}">x${j + 1}</label>
        `;
      } else {
        input.innerHTML = `
      <input type="number" id="d${i + 1}" name="d${i + 1}" required />
      <span></span>
      <label for="d${i + 1}">d${i + 1}</label>
      `;
      }

      matrixInputs.appendChild(input);
    }
  }
}
