import {
  getCurrentUserInfo,
  getAllPosts,
  getPost,
  deleteRequest,
  updateRequest,
} from "./requests.js";

// Renderiza todos os posts
export async function renderAllPosts() {
  const postSection = document.querySelector(".posts");
  postSection.innerHTML = "";
  const posts = await getAllPosts();

 
  for (let i = 0; i < posts.length; i++) {
    const postArticle = await renderPost(posts[i], true);
    postSection.appendChild(postArticle);
  }

  showModalEditPost();
  modalEdit();
  confirmDeleteModal();
  showfullPost();
  confirmDelete();
}

// Renderiza um post
async function renderPost(post) {
  const postContainer = document.createElement("article");
  postContainer.classList.add("post");

  const postTitle = document.createElement("h2");
  postTitle.classList.add("post__title", "text1", "bolder");
  postTitle.innerText = post.title;

  const postContent = document.createElement("p");
  postContent.classList.add("post__content", "text3");

  const postHeader = await renderPostHeader(post);

  postContent.classList.add("post__content--feed", "text3");
  postContent.innerText = post.content;

  const openButton = document.createElement("a");
  openButton.classList.add("post__open", "text3", "bold");
  openButton.innerText = "Acessar publicação";
  openButton.dataset.id = post.id;

  postContainer.append(postHeader, postTitle, postContent, openButton);

  return postContainer;
}

// Verifica a permissao do usuário para editar/deletar um post
async function checkEditPermission(authorID) {
  const { id } = await getCurrentUserInfo();

  if (Object.values({ id }, [0]).toString() == authorID) {
    return true;
  } else {
    return false;
  }
}

// Renderiza o cabeçalho de um post no feed
async function renderPostHeader(post) {
  const userInfo = post.user;

  const postDateInfo = handleDate(post.createdAt);

  const postHeader = document.createElement("header");
  postHeader.classList.add("post__header");

  const postInfo = document.createElement("div");
  postInfo.classList.add("post__info");

  const authorImage = document.createElement("img");
  authorImage.classList.add("post__author-image");
  authorImage.src = userInfo.avatar;

  const authorName = document.createElement("h2");
  authorName.classList.add("post__author-name", "text4", "bolder");
  authorName.innerText = userInfo.username;

  const divisor = document.createElement("small");
  divisor.innerText = "|";
  divisor.classList.add("post__date", "text4");

  const postDate = document.createElement("small");
  postDate.classList.add("post__date", "text4");
  postDate.innerText = postDateInfo;

  postInfo.append(authorImage, authorName, divisor, postDate);

  postHeader.appendChild(postInfo);

  const editable = await checkEditPermission(userInfo.id);

  if (editable) {
    const postActions = renderPostActions(post.id);
    postHeader.appendChild(postActions);
  }

  return postHeader;
}

// Renderiza as opções de "Editar" e "Deletar" caso o usuário seja dono do post
function renderPostActions(postID) {
  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("post__actions");

  const editButton = document.createElement("button");
  editButton.classList.add(
    "post__button--edit",
    "btn",
    "btn--gray",
    "btn--small",
    "text4"
  );
  editButton.dataset.id = postID;
  editButton.innerText = "Editar";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "post__button--delete",
    "btn",
    "btn--gray",
    "btn--small",
    "text4"
  );
  deleteButton.dataset.id = postID;
  deleteButton.innerText = "Excluir";

  actionsContainer.append(editButton, deleteButton);

  return actionsContainer;
}

// Lida com a data atual
function handleDate(timeStamp) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const date = new Date(timeStamp);
  const month = months.at(date.getMonth());
  const year = date.getFullYear();

  return `${month} de ${year}`;
}

export const renderFullPostModal = ({ user, created_at, title, content }) => {
  const userImg = document.querySelector(".user__imgs-modal");
  const userNameModal = document.querySelector(".user__name-modal");
  const userDate = document.querySelector(".post__date-modal");
  const postTitle = document.querySelector(".post__title-modal");
  const postContent = document.querySelector(".post__content-modal");

  userImg.src = user.avatar;
  postTitle.innerText = title;
  userNameModal.innerText = user.username;
  userDate.innerText = handleDate(created_at);
  postContent.innerText = content;
};

export const showfullPost = () => {
  const fullPost = document.querySelector(".modal__fullPost");
  const postsOpen = document.querySelectorAll(".post__open");

  postsOpen.forEach((postOpen) => {
    postOpen.addEventListener("click", (event) => {
      const postId = event.target.dataset.id;

      getPost(postId);

      fullPost.showModal();

      closefullPost();
    });
  });
};

const closefullPost = () => {
  const closeButton = document.querySelector(".modal__close-modal");
  const fullPost = document.querySelector(".modal__fullPost");
  closeButton.addEventListener("click", () => fullPost.close());
};

const confirmDeleteModal = () => {
  const buttons = document.querySelectorAll(".post__button--delete");
  const modal = document.querySelector(".confirm__delete-modal");
  const buttonDelete = document.querySelector(".post-delet-button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.dataset.id;

      buttonDelete.dataset.id = id;
      modal.showModal();
    });
  });
};

const confirmDelete = () => {
  const buttonDelete = document.querySelector(".post-delet-button");
  const modal = document.querySelector(".confirm__delete-modal");

  buttonDelete.addEventListener("click", (event) => {
    const id = event.target.dataset.id;
    deleteRequest(id);
    modal.close();
  });
};

const showModalEditPost = () => {
  const buttons = document.querySelectorAll(".post__button--edit");
  const modal = document.querySelector(".modal__controller__edit");

  buttons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      modal.showModal();
    });
    buttonsCloseModals();
  });
};

const modalEdit = async () => {
  const buttonsId = document.querySelectorAll(".post__button--edit");
  const buttonEdit = document.querySelector(".publish__edit");
  const inputs = document.querySelectorAll(".post__edit");

  buttonsId.forEach((buttonId) => {
    buttonId.addEventListener("click", async (event) => {
      let id = event.target.dataset.id;
      const { title, content } = await getPost(id);

      inputs.forEach((input) => {
        if (input.name === "title") {
          input.value = title;
        } else {
          input.value = content;
        }
      });
      buttonEdit.dataset.id = id;
    });
  });
};
export const handleEditModal = () => {
  const modal = document.querySelector(".modal__controller__edit");
  const buttonEdit = document.querySelector(".publish__edit");
  const inputs = document.querySelectorAll(".post__edit");

  buttonEdit.addEventListener("click", async () => {
    const body = {};
    inputs.forEach((input) => {
      body[input.name] = input.value;
    });
    let id = buttonEdit.dataset.id;
    await updateRequest(id, body);
    modal.close();
  });
};

const buttonsCloseModals = () => {
  const buttons = document.querySelectorAll(".close__modal");
  const modalControllerEdit = document.querySelector(
    ".modal__controller__edit"
  );
  const confirmDeleteModal = document.querySelector(".confirm__delete-modal");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      modalControllerEdit.close();
      confirmDeleteModal.close();
    });
  });
};


