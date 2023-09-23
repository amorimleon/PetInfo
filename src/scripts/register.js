import { registerRequest, red } from "./requests.js";
import { toast } from "./toast.js";


// Desenvolva as funcionalidades de cadastro aqui
export const handleRegister = () => {
  const inputs = document.querySelectorAll("input");
  const button = document.querySelector("#register__submit");
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const registerBody = {};
    let count = 0;

    inputs.forEach((input) => {
      input.value.trim() === "" 
      ? count++ 
      : registerBody[input.name]=input.value;
    });
    
    count !== 0
      ? toast("Por favor, preencha todos os campos", red)
      : registerRequest(registerBody);
  });
};

handleRegister();
