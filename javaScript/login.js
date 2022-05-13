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
