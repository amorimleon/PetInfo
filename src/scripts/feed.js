import { renderAllPosts, handleEditModal } from "./render.js";
import { createPostRequest, getCurrentUserInfo } from "./requests.js";

const autentication = () => {
  const token = localStorage.getItem("@petinfo:token");

  if (!token) {
    location.replace("../../");
  }
};

async function showUserMenu() {
  const userAction = document.querySelector(".user__image");
  const menu = document.querySelector(".user__logout");
  const uniquename = document.querySelector(".user__uniquename ");
  const user = await getCurrentUserInfo();
  userAction.addEventListener("click", (e) => {
    menu.classList.toggle("hidden");
  });

  userAction.src = user.avatar;
  uniquename.innerText = `@${user.username}`;
}

function main() {
  // Adiciona os eventos de click ao menu flutuante de logout
  showUserMenu();
  // Renderiza todos os posts no feed (render.js)
  renderAllPosts();
  handleModalCreatePost();
  handleNewPost();
  
}

const handleModalCreatePost = () => {
  const modalContainer = document.querySelector(".modal__controller__post");
  const userNewpost = document.querySelector("#user__newpost");

  userNewpost.addEventListener("click", () => {
    modalContainer.showModal();

    buttonsCloseModal();
  });
};

const buttonsCloseModal = () => {
  const buttons = document.querySelectorAll(".close__modal");
  const modalContainer = document.querySelector(".modal__controller__post");
  const infos = document.querySelectorAll(".post__info");

  buttons.forEach((button) => {
    infos.forEach((info) => {
      button.addEventListener("click", () => {
        info.value = "";
        modalContainer.close();
      });
    });
  });
};

const handleNewPost = () => {
  const publishButton = document.querySelector(".publish__post");
  const infos = document.querySelectorAll(".post__info");
  const modalContainer = document.querySelector(".modal__controller__post");

  const postInfo = {};
  publishButton.addEventListener("click", () => {
    infos.forEach((info) => {
      postInfo[info.name] = info.value;
      info.value = "";
    });

    createPostRequest(postInfo);
    modalContainer.close();
    // renderAllPosts()
  });
};

const logout = () => {
  const logoutButton = document.querySelector(".logout__button");

  logoutButton.addEventListener("click", () => {
    localStorage.clear();
    location.replace("../../");
  });
};

autentication();
main();
logout();
handleEditModal();
