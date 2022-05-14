function addMatrixInputs(rows, cols) {
  let matrixInputs = document.querySelector(".matrix-values");

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
          <input type="number" id="x${i + 1}${j + 1}" name="x${i + 1}${
          j + 1
        }" required />
          <span></span>
          <label for="x${i + 1}${j + 1}">d${i + 1}</label>
          `;
      }

      matrixInputs.appendChild(input);
    }
  }
}
addMatrixInputs(3, 4);

//Matrix Submit
const matrixForm = document.getElementById("matrix-form");
matrixForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const matrixMethod = document.getElementById("matrixMethod").value;
  let matrix = create2DMatrix(3, 4);
  switch (matrixMethod) {
    case "gauss":
      gauss(matrix);
      break;
    case "lu":
      lu(matrix);
      break;
    case "lup":
      lup(matrix);
      break;
    case "cramer":
      cramer(matrix);
      break;
  }
});

// Matrix Methods

function create2DMatrix(rows, cols) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
      matrix[i][j] = document.getElementById(`x${i + 1}${j + 1}`).value;
    }
  }
  return matrix;
}

//Gauwss Jordan Elimination
function gauss(m) {
  clearMatrixSolution();

  calculateM(m);

  dispalyMatrix(m);

  let x3 = m[2][3] / m[2][2];
  let x2 = (m[1][3] - m[1][2] * x3) / m[1][1];
  let x1 = (m[0][3] - (m[0][1] * x2 + m[0][2] * x3)) / m[0][0];

  displayX(x1, x2, x3);
}

function displayM(m21, m31, m32) {
  const mContainer = document.querySelector(".m");
  let arr = [m21, m31, m32];
  let order = ["21", "31", "32"];
  for (let i = 0; i < 3; i++) {
    let m = document.createElement("h2");
    m.innerHTML = `m<span class="sub">${order[i]}</span> = ${arr[i]}`;
    mContainer.appendChild(m);
  }
}

function dispalyMatrix(matrix) {
  const matrixContainer = document.getElementById("matrix-container");
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      let number = Number(matrix[i][j]).toFixed(1);

      let span = document.createElement("span");

      if (j === matrix[0].length - 1)
        span.setAttribute("class", "last-col-item");

      span.innerHTML = `${number}`;
      matrixContainer.appendChild(span);
    }
  }
}

function displayX(x1, x2, x3) {
  const results = [x1, x2, x3];
  const resultContainer = document.querySelector(".result");
  for (let i = 0; i < 3; i++) {
    let result = document.createElement("h2");
    result.innerHTML = `
      <h2>x<span class="sub">${i + 1}</span> = ${results[i].toFixed(1)}`;
    resultContainer.appendChild(result);
  }
}

function clearMatrixSolution() {
  let matrixContainer = document.querySelectorAll(
    ".matrix-mode .solution .container *"
  );

  for (let i = 0; i < matrixContainer.length; i++) {
    matrixContainer[i].innerHTML = "";
  }
}

function calculateM(m, partialPivoting = false) {
  let m21 = m[1][0] / m[0][0];
  let m31 = m[2][0] / m[0][0];

  //rule R2-(m21)R1 = R2
  for (let j = 0; j < 4; j++) {
    let r2 = m[1][j];
    let r1 = m21 * m[0][j];
    m[1][j] = r2 - r1;
  }

  //rule R3-(m31)R1 = R3
  for (let j = 0; j < 4; j++) {
    let r3 = m[2][j];
    let r1 = m31 * m[0][j];
    m[2][j] = r3 - r1;
  }

  let m32 = m[2][1] / m[1][1];

  displayM(m21, m31, m32);

  //rule R3-(m31)R1 = R3
  for (let j = 0; j < 4; j++) {
    let r3 = m[2][j];
    let r1 = m32 * m[1][j];
    m[2][j] = r3 - r1;
  }
  let arr = [m21, m31, m32];
  return arr;
}

function lu(matrix) {
  clearMatrixSolution();
  let b = [3];
  for (let i = 0; i < 3; i++) {
    b[i] = matrix[i][3];
  }

  const ms = calculateM(matrix); // array contain m21, m31, m32

  let u = [];
  for (let i = 0; i < 3; i++) {
    u[i] = [];
    for (let j = 0; j < 3; j++) {
      u[i][j] = matrix[i][j];
    }
  }

  let l = [];
  l[0] = [1, 0, 0];
  l[1] = [ms[0], 1, 0];
  l[2] = [ms[1], ms[2], 1];

  let c1 = b[0] / l[0][0];
  let c2 = (b[1] - l[1][0] * c1) / l[1][1];
  let c3 = (b[2] - (l[2][0] * c1 + l[2][1] * c2)) / l[2][2];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = u[i][j];
    }
  }

  matrix[0][3] = c1;
  matrix[1][3] = c2;
  matrix[2][3] = c3;

  dispalyMatrix(matrix);

  let x3 = matrix[2][3] / matrix[2][2];
  let x2 = (matrix[1][3] - matrix[1][2] * x3) / matrix[1][1];
  let x1 =
    (matrix[0][3] - (matrix[0][1] * x2 + matrix[0][2] * x3)) / matrix[0][0];

  displayX(x1, x2, x3);
}

function lup(matrix) {
  clearMatrixSolution();
  let matrices = math.lup(matrix);
  displayM(
    matrices.L[2][0].toFixed(1),
    matrices.L[1][0].toFixed(1),
    matrices.L[2][1].toFixed(1)
  );
  dispalyMatrix(matrices.U);

  let x3 = matrices.U[2][3] / matrices.U[2][2];
  let x2 = (matrices.U[1][3] - matrices.U[1][2] * x3) / matrices.U[1][1];
  let x1 =
    (matrices.U[0][3] - (matrices.U[0][1] * x2 + matrix[0][2] * x3)) /
    matrices.U[0][0];

  displayX(x1, x2, x3);
}

function cramer(matrix) {
  clearMatrixSolution();

  let a = []; // a is 3x3 matrix of equation without the answers (without d)
  let d = []; // d is 1x3 matrix of answers of equations
  for (let i = 0; i < matrix.length; i++) {
    a[i] = [];
    for (let j = 0; j < matrix[0].length; j++) {
      if (j === matrix[0].length - 1) {
        d[i] = matrix[i][j];
        continue;
      }
      a[i][j] = matrix[i][j];
    }
  }

  let det = math.det(a);

  //deep copy a to arrys x1,x2,x3
  let arr1 = JSON.parse(JSON.stringify(a));
  let arr2 = JSON.parse(JSON.stringify(a));
  let arr3 = JSON.parse(JSON.stringify(a));

  //swaping columns of x matrices with d
  for (let i = 0; i < 3; i++) {
    arr1[i][0] = d[i];
    arr2[i][1] = d[i];
    arr3[i][2] = d[i];
  }

  let det1 = math.det(arr1);
  let det2 = math.det(arr2);
  let det3 = math.det(arr3);

  let x1 = det1 / det;
  let x2 = det2 / det;
  let x3 = det3 / det;

  displayX(x1, x2, x3);
}
