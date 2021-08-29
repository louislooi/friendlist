//Set initial variables
const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = [];
const USER_PER_PAGE = 12;
let filteredUsers = [];

//Match selectors with HTML elements
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

//Functions

//Render user list on the data panel
function renderUsersList(data) {
  let rawHTML = "";
  //Insert HTML tags into template
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3 ">
    <div class="mb-5 ">
      <div class="card text-center shadow p-3 mb-5 bg-body rounded">
        <img src="${item.avatar}" class="card-img-top rounded-circle w-75 mx-auto mt-4" alt="People's face">
        <div class="card-body description">
          <h3 class="card-title">${item.name} ${item.surname}</h3>
          <p class="card-title">${item.region}</p>
          <p class="card-title">${item.age} yr</p>
        </div>
          <button class="btn btn-primary btn-show-user rounded-pill" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
          <button class="mt-2 btn btn-info btn-add-favorite rounded-pill" data-id="${item.id}">+</button>
        
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//Return the number of page based on number of users available
function getUsersByPages(page) {
  const data = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * USER_PER_PAGE;
  return data.slice(startIndex, startIndex + USER_PER_PAGE);
}

//Render paginator
function renderPaginator(amount) {
  //Calc total number
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE);
  
  let rawHTML = "";
  //Put content into each template
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }//Render template
  paginator.innerHTML = rawHTML;
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
    //Render uesr data
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="User Photo">`;
    modalInfo.innerHTML = `<p>Gender: ${data.gender}<br>Age: ${data.age}<br>Region:  ${data.region}<br>Birthday: ${data.birthday}<br>Email: <a href="${data.email}">${data.email}</a></p>`;
  });
}

//Push favourite user to local storage
function addToFavorite(id) {
  //Get data from localStorage, if there is nothing inside then create one
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
  //Match the seleted user id
  const user = users.find((user) => user.id === id);
  //Return wrong alert if the user is already there
  if (list.some((user) => user.id === id)) {
    return alert("This friend is already on the lists!");
  }
  list.push(user);
  localStorage.setItem("favoriteUsers", JSON.stringify(list));
}

//Event handler

//Listen to search form
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  //Prevent refresh
  event.preventDefault();
  //Set the keyword to lower case, and trim down the white space 
  const keyword = searchInput.value.trim().toLowerCase();
  //Search the match for first name
  const firstName = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  );
  //Search the match for surname
  const surname = users.filter((user) =>
    user.surname.toLowerCase().includes(keyword)
  );
  //Combine the results
  filteredUsers = firstName.concat(surname);
//If no result, then return nothing found
  if (filteredUsers.length === 0) {
    return alert(`${keyword} not found`);
  }

  renderPaginator(filteredUsers.length);
  renderUsersList(getUsersByPages(1));
});

//Listen to data panel
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    //Render user modal
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    //Add the selected user to favourite
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);

  renderUsersList(getUsersByPages(page));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderPaginator(users.length);
    renderUsersList(getUsersByPages(1));
  })
  .catch((err) => console.log(err));
