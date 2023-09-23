// Desenvolva as funcionalidades de login aqui
import { loginRequest, red } from "./requests.js";
import { toast } from "./toast.js";

const handleLogin = () => {
  const inputs = document.querySelectorAll("input");
  const button = document.querySelector("#login__submit");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const loginBody = {};
   
    let count = 0;

    inputs.forEach((input) => {
      input.value.trim() === ""
        ? count++
        : (loginBody[input.name] = input.value);
    });
    count !== 0
      ? toast("Por favor, preencha todos os campos necessários", red)
      : loginRequest(loginBody);
  });
};

const buttonRegisterUser = () => {
  const button = document.querySelector("#register__button");

  button.addEventListener("click", () => {
    return location.replace("./src/pages/register.html");
  });
};

handleLogin();
buttonRegisterUser();
