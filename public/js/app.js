"use strict"
let menu = document.getElementById("menu");

view();

//display correct html
function view(){
  //userResponse.innerHTML = "";
  if(!checkAuthentication()){
    addTemplate("userTemplate");
    let userForm = document.getElementById("newUser");
    userForm.onsubmit = createUser;

    let btnLogin = document.getElementById("login");
    btnLogin.onclick = loginUser;
    menu.style.display = "none";
  }
  else {
    addTemplate("listViewTemplate");

    let listForm = document.getElementById("createList");
    listForm.onsubmit = createList;
    menu.style.display = "";

    let user = JSON.parse(localStorage.getItem("user"));
    let userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = "Innlogget: " + user.name;

    let listMenu = document.getElementById("listMenu");
    listMenu.onclick = allLists;

  }
}

//switching templates
function addTemplate(templId){
  let container = document.getElementById("container");
  container.innerHTML = "";

  let templ = document.getElementById(templId);
  let clone = templ.content.cloneNode(true);
  container.appendChild(clone);
}

//---------create user-----------
async function createUser(evt){
  evt.preventDefault();
  let username = document.getElementById("newUsername").value;
  let name = document.getElementById("newName").value;
  let email = document.getElementById("newEmail").value;
  let password = document.getElementById("newPsw").value;
  let createUserResp = document.getElementById("createUserResp");
  let okPassword = checkPassword(password);

  if(!okPassword){
    createUserResp.innerHTML = "Passordet må være minst 5 tegn";
  }
  else {

    try {
      let response = await fetch("/app/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          username: username,
          name: name,
          email: email,
          password: password
        })
      });
      let data = await response.json();
      if(response.status === 200 ){
        createUserResp.innerHTML = "Bruker er opprettet, logg inn for å fortsette";
      }
      else if (response.status === 400){
        createUserResp.innerHTML = data.message;
      }

    } catch(err){
      createUserResp.innerHTML = "Noe gikk galt: " + err;
      console.log(err);
    }
  }
}

function checkPassword(password){
  return password.length>4;
}

//-------------- Login user------------
async function loginUser(){
  let username = document.getElementById("userName").value;
  let password = document.getElementById("userPsw").value;
  let userResp = document.getElementById("userResp");

  let credentials = `Basic ${ btoa(username + ":" + password)}`;
  try{
    let response = await fetch("/app/authenticate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": credentials
      }
    });
    let data = await response.json();
    if(response.status === 200){
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      userResp.innerHTML = "";
      view();
      usersLists();

    }
    else if(response.status === 401){
      userResp.innerHTML = data.message;
    }
    else if(response.status === 500){
      userResp.innerHTML = data.message;
    }
  }
  catch(error) {
    console.log(error);
  }
}

function checkAuthentication(){
  let user = JSON.parse(localStorage.getItem("user"));

  if(user){
    return true;
  }
  return false;
}

let btnLogout = document.getElementById("logout");
btnLogout.onclick = logOut;

function logOut(){
  localStorage.removeItem("user");
  localStorage.removeItem("listId");
  localStorage.removeItem("token");
  view();
}

let updUserBtn = document.getElementById("updUser");
updUser.onclick = updateUserInfo;

function updateUserInfo(){
  addTemplate("updateUserTemplate");
  let upd = document.getElementById("updUserSelect");
  upd.onclick = updUserColumn;

  let btnDel = document.getElementById("delete");
  btnDel.onclick = deleting;

  let userResponse = document.getElementById("userResponse");
}

function updUserColumn(evt){
  userResponse.innerHTML = "";
  let hr = document.createElement("hr");
  let update = document.createElement("div");
  update.classList.add("updateMode");
  update.id = "updateMode";
  update.appendChild(hr);
  evt.target.appendChild(update);
  let column = evt.target.id;
  let label = document.createElement("label");
  label.setAttribute("for", column);
  label.innerHTML = "Sett ny verdi for " + column + " ";
  update.appendChild(label);

  let inp = document.createElement("input");
  inp.type = "text";
  inp.name = column;
  inp.id = "newUserVal";
  update.appendChild(inp);

  let btn = document.createElement("button");
  btn.innerHTML = "Lagre";
  btn.classList.add("btnMedium");
  update.appendChild(btn);
  btn.id = column;
  if(column === 'password'){
    btn.onclick = updateUserPsw;
  }
  else btn.onclick = updateUser;
}

//update users name, email, username
async function updateUser(evt){
  let newValue = document.getElementById("newUserVal").value;
  let column = evt.target.id;
  let user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("updateMode").remove();

  try {
    let response = await fetch("/app/user/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        userid: user.id,
        column: column,
        value: newValue
      })
    });

    let data = await response.json();
    if(response.status === 200){
      userResponse.innerHTML = "New " + column + ": " + data[column];
    }
    else if(response.status === 400){
      userResponse.innerHTML = column + " " + data.message;
    }
    else if(response.status === 401){
      userResponse.innerHTML = data.message;
    }


  } catch(err){
    userResponse.innerHTML = "Noe gikk galt";
  }
}

//update users password
async function updateUserPsw(){

  let newValue = document.getElementById("newVal").value;
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch("/app/user/updateUserPsw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        userid: user.id,
        password: newValue
      })
    });

    let data = await response.json();
    if(response.status === 200){
      userResponse.innerHTML = "passord oppdatert";
    }
    else if(response.status === 401){
      userResponse.innerHTML = data.message;
    }

  } catch(err){
    userResponse.innerHTML = "Noe gikk galt";
  }

}

async function deleting(){
  let delUser =  window.confirm("Er du sikker? Sletting av kontoen din vil også slette alle listene dine.");
  if(delUser){
    await deleteUsersLists();
    await deleteUser();
  }

}

// ---------- delete users lists ----------
async function deleteUsersLists(){
  let user = JSON.parse(localStorage.getItem("user"));
  try {
    let response = await fetch(`app/list/deleteAllLists/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
    });

    let data = await response.json();

  } catch(err){
    console.log(err);
  }

}

// --------- delete user ------------
async function deleteUser(){
  let user = JSON.parse(localStorage.getItem("user"));
  try {
    let response = await fetch(`app/user/deleteUser/${user.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
    });

    let data = await response.json();
    if(data.length === 1){
      userResponse.innerHTML = "Bruker " + data[0].username + " slettet";
      logOut();
    }
    else userResponse.innerHTML = "Noe gikk galt..";

  } catch(err){
    console.log(err);
  }
}

// ---------- user metrics ----------
let btnMetrics = document.getElementById("metrics");
//btnMetrics.onclick = showMetrics;

async function showMetrics(){
  addTemplate("userMetricsTemplate");
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch(`app/user/metrics/${user.id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });

    let data = await response.json();
    if(data[0]){
      showOutput(data[0]);
    }
  } catch(err){

  }

}

//display user metrics
function showOutput(data){
  let container = document.getElementById("userMetrics");
  let output = document.createElement("div");
  output.classList.add("output");
  container.appendChild(output);

  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let div3 = document.createElement("div");
  let div4 = document.createElement("div");

  div1.innerHTML = "Total lists: " + data.lists;
  div2.innerHTML = "Total items in all lists: " + data.items;
  div3.innerHTML = "Shared lists: " + data.sharedlists;
  div4.innerHTML = "Done lists: " + data.donelists;

  output.appendChild(div1);
  output.appendChild(div2);
  output.appendChild(div3);
  output.appendChild(div4);
}


let listHead = document.getElementById("allLists");
listHead.onclick =allLists;

let backBtn = document.getElementById("menuBack");
backBtn.onclick =allLists;

function allLists(){
  view();
  usersLists();
}

let menuBtn = document.getElementById("menuBtn");
menuBtn.onclick = showMenu;

function showMenu() {
  let menuCont = document.getElementById("menu-content");
  menuCont.style.display = "block";
}

//skjule meny hvis man trykker et annet sted
window.onclick = function(event) {
  if (!event.target.matches('#menuImg')) {
     document.getElementById("menu-content").style.display = "none";
  }
}
