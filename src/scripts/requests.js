import { renderAllPosts, renderFullPostModal } from "./render.js";
import { toast } from "./toast.js";

const baseUrl = "http://localhost:3333";
const token = localStorage.getItem("@petinfo:token");
console.log(token)
export const red = "var(--alert-1);";
export const blue = "var(--brand-1)";

const requestHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export async function getCurrentUserInfo() {
  const request = await fetch(`${baseUrl}/users/profile`, {
    method: "GET",
    headers: requestHeaders,
  });
  const user = await request.json();

  return user;
}
// Listagem de posts
export async function getAllPosts() {
  const request = await fetch(`${baseUrl}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const posts = await request.json();

  return posts;
}

const alertInput = (message) => {
  const wrongEmail = document.querySelector("#wrong-email");
  const wrongPassword = document.querySelector("#wrong-password");
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    if (input.id === "Email") {
      if (message === "O email está incorreto") {
        if (wrongEmail.classList.contains("hidden")) {
          input.classList.add("alert__input");
          wrongEmail.classList.remove("hidden");
        }
      }
    } else {
      if (message === "A senha está incorreta") {
        if (wrongPassword.classList.contains("hidden")) {
          wrongPassword.classList.remove("hidden");
          input.classList.add("alert__input");
        }
      }
    }
  });
};

// Desenvolva as funcionalidades de requisições aqui
export const loginRequest = async (loginBody) => {
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(loginBody),
  };

  const responseJSON = await fetch(`${baseUrl}/login`, options).then(
    async (response) => {
      const convert = await response.json();

      if (response.ok) {
        toast("login realizado com sucesso", blue);
        localStorage.setItem("@petinfo:token", convert.token);

        setTimeout(() => {
          location.replace("./src/pages/feed.html");
        }, 1000);
      } else {
        alertInput(convert.message);
      }

      return convert;
    }
  );
  return responseJSON;
};

export const registerRequest = async (body) => {
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(body),
  };

  const responseJSON = await fetch(`${baseUrl}/users/create`, options)
    .then(async (response) => {
      const convert = await response.json();
      if (response.ok) {
        toast("Cadastro realizado com sucesso", blue);
        setTimeout(() => {
          location.replace("../../index.html");
        }, 1000);
      } else {
        throw new Error(convert.message);
      }
      return convert;
    })
    .catch((err) => toast(err));
  return responseJSON;
};

export const createPostRequest = async (body) => {
  const options = {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(body),
  };

  const responseJSON = await fetch(`${baseUrl}/posts/create`, options).then(
    async (response) => {
      const convert = await response.json();

      if (response.ok) {
        toast("Post criado com sucesso", blue);
      }
      return convert;
    }
  );
  // .catch((err) => toast(err));

  return responseJSON;
};

export const getPost = async (postId) => {
  const options = {
    method: "GET",
    headers: requestHeaders,
  };

  const responseJSON = await fetch(`${baseUrl}/posts/${postId}`, options)

   const response = await responseJSON.json()
   if (responseJSON.ok) {
   
    renderFullPostModal(response);
  }
  return response;
  
};

export const deleteRequest = async (deleteId) => {
  const options = {
    method: "DELETE",
    headers: requestHeaders,
  };

  const responseJSON = await fetch(
    `${baseUrl}/posts/${deleteId}`,
    options
  ).then(async (response) => {
    const convert = response.json();

    if (response.ok) {
      toast("Post apagado!");
      renderAllPosts();
    }
  });
};

export const updateRequest = async (updateId, body) => {
  const options = {
    method: "PATCH",
    headers: requestHeaders,
    body: JSON.stringify(body),
  };

  const responseJSON = await fetch(
    `${baseUrl}/posts/${updateId}`,
    options
  ).then(async (response) => {
    const convert = response.json();

    if (response.ok) {
      toast("Post Atualizado", blue);

      renderAllPosts();
    }
  });
};
