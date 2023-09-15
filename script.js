// Selecting DOM elements
let btnContainer = document.querySelector(".btn-container");
let signinBtn = document.querySelector(".signin");
let signupBtn = document.querySelector(".signup");
let signinForm = document.querySelector(".signin-form");
let signupForm = document.querySelector(".signup-form");
let login = document.querySelector(".login");
let register = document.querySelector(".register");

// reset password elements
let secretCode = document.querySelector(".secret-code");
let changePassForm = document.querySelector(".changePass-form");
let changeInputPassContainer = document.querySelector(".change-pass");
let retrieveEmail = document.querySelector(".retrieve-email");
let newPass = document.querySelector(".new-pass");
let confirmNewPass = document.querySelector(".confirm-new-pass");
let resetClick = document.querySelector(".reset");
let resetError = document.querySelector(".reset-error");

// Signup form details
let signupEmail = document.querySelector(".signup-email");
let signupPassword = document.querySelector(".signup-pass");
let signupConfirmPass = document.querySelector(".signup-confirmPass"); // Fixed the typo here
let signupSecretCode = document.querySelector(".signup-petName");
let signupError = document.querySelector(".signup-error");

// Signin form details
let signinEmail = document.querySelector(".signin-email");
let signinPassword = document.querySelector(".signin-pass");
let signinError = document.querySelector(".signin-error");

// Creating local storage if it doesn't exist
if (!localStorage.getItem("LoginList")) {
  localStorage.setItem("LoginList", "[]");
}

// Getting local storage
let loginList = JSON.parse(localStorage.getItem("LoginList")) || [];

// Manage top button clicking styling
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signupBtn.style.backgroundColor = "pink";
  signinBtn.style.backgroundColor = "#fff";
  signinBtn.style.color = "grey";
  signupBtn.style.color = "#fff";
  signinForm.style.display = "none";
  signupForm.style.display = "block";
  changePassForm.style.display = "none";
});

// Manage top button clicking styling
signinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signinBtn.style.backgroundColor = "#33ccff";
  signupBtn.style.backgroundColor = "#fff";
  signupBtn.style.color = "grey";
  signinBtn.style.color = "#fff";
  signupForm.style.display = "none";
  signinForm.style.display = "block";
  changePassForm.style.display = "none";
});

// Function to empty signin fields
const emptySigninFields = () => {
  signinEmail.value = "";
  signinPassword.value = "";
};

login.addEventListener("click", (e) => {
  e.preventDefault();
  let loggedUserExists = loginList.some(
    (person) => person.Email === signinEmail.value
  );
  let incorrectPassword = loginList.some(
    (person) => person.Password === signinPassword.value
  );

  if (signinEmail.value === "" || signinPassword.value === "") {
    signinError.textContent = "All fields are mandatory.";
  } else if (!loggedUserExists) {
    signinError.textContent = "User does not exist.";
  } else if (!incorrectPassword) {
    signinError.textContent = "Incorrect credentials.";
    emptySigninFields();
    return;
  } else {
    let user = loginList.find((person) => person.Email === signinEmail.value);

    localStorage.setItem("LoginUser", JSON.stringify(user));
    window.location.href = "./home.html";
    emptySigninFields();
  }
});

// Function to empty all signup fields
const emptySignupFields = () => {
  signupEmail.value = "";
  signupPassword.value = "";
  signupConfirmPass.value = "";
  signupSecretCode.value = "";
};

register.addEventListener("click", (e) => {
  e.preventDefault();

  let userExists = loginList.some(
    (person) => person.Email === signupEmail.value
  );
  if (
    signupEmail.value === "" ||
    signupPassword.value === "" ||
    signupConfirmPass.value === "" ||
    signupSecretCode.value === ""
  ) {
    signupError.textContent = "All fields are mandatory.";
    return;
  } else if (signupPassword.value !== signupConfirmPass.value) {
    signupError.textContent =
      "Please check that password and confirm password match.";
    emptySignupFields();
    return;
  } else if (userExists) {
    signupError.textContent = "A user with this email already exists.";
    emptySignupFields();
    return;
  }

  // person details
  let person = {
    Email: signupEmail.value,
    Password: signupPassword.value,
    SecretCode: signupSecretCode.value,
  };

  loginList.push(person);
  localStorage.setItem("LoginList", JSON.stringify(loginList));
  emptySignupFields();
  signupError.innerHTML = `<span>Account created successfully. <a href="#">Login</a></span>`;
  signupError.style.color = "green";
});

// bottom links
let handleCreateone = () => {
  // Hide the signin form and show the signup form
  signinForm.style.display = "none";
  signupForm.style.display = "block";
};

let continueAsGuest = () => {
  //open link to home page
  window.location.href = "./home.html";
};

let forgetPassword = () => {
  signinForm.style.display = "none";
  signupForm.style.display = "none";
  changePassForm.style.display = "block";
  btnContainer.style.display = "none";
  changeInputPassContainer.style.display = "none";
};

resetClick.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirmNewPass.value !== newPass.value) {
    resetError.textContent = "Password and confirm password do not match.";
    resetError.classList.remove("reset-success");
    resetError.classList.add("reset-error");
    return;
  } else {
    let newPassword = newPass.value;
    loginList = loginList.map((person) =>
      person.Email === retrieveEmail.value
        ? { ...person, Password: newPassword }
        : person
    );
    localStorage.setItem("LoginList", JSON.stringify(loginList));
    resetError.innerHTML = `<span>Password changed successfully <span onclick="loginFormOpen()"><u>Login</u></span></span>`;
  }
});

secretCode.addEventListener("input", () => {
  let userEmail = loginList.some(
    (person) => person.Email === retrieveEmail.value
  );
  let userSecretCode = loginList.some(
    (person) => person.SecretCode === secretCode.value
  );

  if (userEmail && userSecretCode && secretCode.value.length === 4) {
    changePassForm.style.display = "block";
    changeInputPassContainer.style.display = "block";
    resetError.textContent = "You can change the password";
    resetError.classList.add("reset-success");
    resetError.classList.remove("reset-error");
  } else {
    if (!userEmail) {
      resetError.textContent = "Please enter a valid email";
      resetError.classList.remove("reset-success");
      return;
    } else {
      resetError.textContent = "Please enter a valid secret code";
      resetError.classList.remove("reset-success");
      return;
    }
  }
  console.log(retrieveEmail.value);
});

let loginFormOpen = () => {
  haveAnAccount();
  changePassForm.style.display = "none";
  btnContainer.style.display = "block"; // Show the button container if it was hidden
  changeInputPassContainer.style.display = "block"; // Show the input container if it was hidden
};

let haveAnAccount = () => {
  // Hide the signup form and show the signin form
  signinForm.style.display = "block";
  signupForm.style.display = "none";
};
