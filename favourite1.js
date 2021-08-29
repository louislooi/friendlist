//Set initial variables
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = JSON.parse(localStorage.getItem("favoriteUsers")) || [];

//Match selectors with HTML elements
const dataPanel = document.querySelector("#data-panel");

//Functions

//Render user list on the data panel
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    //Insert HTML tags into template
    rawHTML += `<div class="col-sm-3">
    <div class="mb-5">
      <div class="card text-center">
        <img src="${item.avatar}" class="card-img-top rounded-circle w-75 mx-auto mt-4" alt="People's face">
        <div class="card-body description">
          <h2 class="card-title">${item.name} ${item.surname}</h2>
          <p class="card-title">${item.region}</p>
          <p class="card-title">${item.age} yr</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//Render user modal based on the user selected
function showUserModal(idNum) {
  //Match selector with HTML elements wanted
  const modalTitle = document.querySelector("#modal-title");
  const modalImage = document.querySelector("#modal-img");
  const modalInfo = document.querySelector("#modal-info");
  //Set the content to none first to avoid showing previous data
  modalTitle.innerText = ``;
  modalImage.innerHTML = ``;
  modalInfo.innerHTML = ``;

  //Get data from API
  axios.get(INDEX_URL + idNum).then((response) => {
    const data = response.data;
    console.log(data.name);
    //Render uesr data
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="User Photo">`;
    modalInfo.innerHTML = `<p>Gender: ${data.gender}<br>Age: ${data.age}<br>Region:  ${data.region}<br>Birthday: ${data.birthday}<br>Email: <a href="${data.email}">${data.email}</a></p>`;
  });
}

//Event handler
dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-user")) {
    //Render user modal
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    //Add the selected user to favourite
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

function removeFromFavorite(id) {
  if (!users) return;

  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return;

  users.splice(userIndex, 1);

  localStorage.setItem("favoriteUsers", JSON.stringify(users));

  renderUserList(users);
}

renderUserList(users);
