//----------Create List-------------
async function createList(evt){
  evt.preventDefault();
  let listname = document.getElementById("listName").value;
  document.getElementById("listName").value = "";
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let url = 'app/list';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listName: listname,
        userId: user.id
      })
    });
    let data = await response.json();

    let listResp = document.getElementById("listResp");
    listResp.classList.add("output");

    if (data.length === 1){
      listResp.innerHTML = "Liste opprettet";
      localStorage.setItem("listId",data[0].listid);
      usersLists();
    }
    else{
      listResp.innerHTML = "Noe gikk galt";
    }

  } catch(err){
    console.log(err);
  }
}

//get users lists
async function usersLists(){
  let lists = document.getElementById("myLists");
  lists.innerHTML = "";

  localStorage.removeItem("listId");
  localStorage.removeItem("icons");
  localStorage.removeItem("edit");
  let user =  JSON.parse(localStorage.getItem("user"));

  try {
    let response = await fetch(`app/list/${user.id}/`, {
      method:"GET",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();

    if(data.length>0){
console.log(data);
      for(let i in data){
        let div = document.createElement("div");
        div.id =  data[i].listid;
        div.classList.add("listName");
        div.innerHTML = data[i].name;
        div.onclick = showList;
        if(data[i].done) {
          div.classList.add("doneList");
        }

        if(data[i].icons) {
          div.setAttribute("icons", "showing");
        }
        else{
          div.setAttribute("icons", "hidden");
        }

        if(data[i].owner !== user.id) {
          if(data[i].edit){
            div.setAttribute("shared", "edit");
          }
          else {
            div.setAttribute("shared", "noedit");
          }
        }

        if(data[i].image !== "post-it") {
          div.setAttribute("image", data[i].image);
        }
        else{
          div.setAttribute("image", "post-it");
        }

        lists.appendChild(div);

      }
    }

  } catch(err){
    console.log(err);
  }
}

//show selected list
function showList(evt){

  let listId = evt.currentTarget.id;
  localStorage.setItem("listId", listId);
//console.log(evt.target);
if(evt.target.getAttribute("image") !== "post-it"){
    document.body.style.backgroundImage = "url(" + 'images/background/'+ evt.target.getAttribute('image') +")";
}
else {
  document.body.style.backgroundImage = "url(" + 'images/background/post-it.png'+")";
}


  if(evt.target.getAttribute("shared") === 'noedit') {
    addTemplate("listDetailsTemplateNoEdit");
    let listName = document.getElementById("currentList");
    listName.innerHTML = evt.currentTarget.innerHTML;
    localStorage.setItem("edit", 'noedit');
  }
  else {
    addTemplate("listDetailsTemplate");

    let listName = document.getElementById("currentList");
    listName.innerHTML = evt.currentTarget.innerHTML;

    let btnDelList = document.getElementById("btnDelList");
    btnDelList.onclick = deleteAllItemsInList;

    let btnEmptList = document.getElementById("btnEmptList");
    btnEmptList.onclick = deleteCheckedItems;

    let itemForm = document.getElementById("addItem");
    itemForm.onsubmit = addItem;

    let btnUpdList = document.getElementById("btnUpdList");
    btnUpdList.onclick = updListName;

    let btnShareList = document.getElementById("btnShareList");
    btnShareList.onclick = shareListStart;

    let btnTagList = document.getElementById("btnTagList");
    btnTagList.onclick = showTags;

    let iconBtn = document.getElementById("btnIconList");
    iconBtn.onclick = toggleIcons;
    if(evt.target.getAttribute("icons") === 'showing'){
      localStorage.setItem("icons", 'showing');
      iconBtn.innerHTML = "Skjul ikoner";
    }
    else if(evt.target.getAttribute("icons") === 'hidden'){
      localStorage.setItem("icons", 'hidden');
      iconBtn.innerHTML = "Vis ikoner";
    }
  }

showItems();
}

//-----------hide or show icons in list--------------
function toggleIcons(evt){

  let btn = evt.target;
  let value = localStorage.getItem("icons");
  let divs = document.querySelectorAll(".iconDiv");
  let listId = localStorage.getItem("listId");

  //hide icons
  if(value === 'showing'){
    localStorage.setItem("icons", 'hidden');
    setIconValue(listId, false);
    btn.innerHTML = "Vis ikoner";
    for(let i=0; i<divs.length; i++){
      divs[i].style.display = "none";
    }
  }

  //show icons
  if(value === 'hidden'){
    localStorage.setItem("icons", 'showing');
    setIconValue(listId, true);
    btn.innerHTML = "Skjul ikoner";
    for(let i=0; i<divs.length; i++){
      divs[i].style.display = "";
    }
  }

}

//Updates icon-value for list
async function setIconValue(listId, value){
  try {
    let url = 'app/list/updateList';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        newvalue: value,
        column: "icons"
      })
    });
    let data = await response.json();

  }
  catch(err){
    console.log(err);
  }

}


//edit listname
function updListName(evt){
  let input = document.createElement("input");
  let button = document.createElement("button");

  input.id = "newVal";
  button.innerHTML = "Oppdater navn";
  button.id = "name";
  button.classList.add("btnMedium");
  button.onclick = updateListName;

  evt.target.parentElement.appendChild(input);
  evt.target.parentElement.appendChild(button);
}

async function updateListName(evt){
  let newValue = document.getElementById("newVal").value;
  let column = evt.target.id;
  let listId = localStorage.getItem("listId");

  try {
    let url = 'app/list/updateList';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        newvalue: newValue,
        column: column
      })
    });
    let data = await response.json();
    if(data){
      document.getElementById("currentList").innerHTML = data.name;
    }
    else {
      //userResponse.innerHTML = "Noe gikk galt";
    }

    removeInput("newVal", "name");

  }
  catch(err){
    console.log(err);
  }

}

//sharing of lists
function shareListStart(evt){
  let input = document.createElement("input");
  let button = document.createElement("button");
  let box = document.createElement("input");
  let label = document.createElement("label");

  let div = document.createElement("div");
  div.id = "shareDiv";
  div.classList.add("addFrame");

  input.id = "newVal";
  input.placeholder = "oppgi brukernavn";
  button.innerHTML = "Del liste";
  button.id = "shareduser";
  button.classList.add("btnMedium");
  button.onclick = shareList;
  box.id = "edit";
  box.type = "checkbox";
  box.checked = true;
  label.id = "editlabel";
  label.setAttribute("for", "edit");
  label.innerHTML = " endre";

  div.appendChild(input);
  div.appendChild(label);
  label.appendChild(box);
  div.appendChild(button);

  evt.target.parentElement.appendChild(div);
}

async function shareList(){
  let username = document.getElementById("newVal").value;
  let listId = localStorage.getItem("listId");
  let listResp = document.getElementById("itemResp");
  let edit = document.getElementById("edit").checked;

  try {
    let response = await fetch('app/list/shareList', {
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        username: username,
        edit: edit
      })
    });
    let data = await response.json();
    if(data.userid){
      listResp.innerHTML = "Liste delt med " + username;
    }
    else {
      listResp.innerHTML = "Noe gikk galt";
    }

    document.getElementById("shareDiv").remove();
  }
  catch(err){

  }
}

let unique_tags = [];

function showTags(evt) {
  if(document.getElementById("tagSearch")) {
    document.getElementById("tagSearch").remove();
  }
  let tagContainer = document.createElement("div");
  tagContainer.id = "tagSearch";
  evt.target.appendChild(tagContainer);
  let showAllTags = document.createElement("p");
  showAllTags.id="showAll";
  showAllTags.innerHTML="Vis alle";
  showAllTags.onclick = filterTags;
  tagContainer.appendChild(showAllTags);
  for (let i in unique_tags){
    let p = document.createElement("p");
    p.id = unique_tags[i];
    p.onclick = filterTags;
    p.innerHTML = unique_tags[i];
    tagContainer.appendChild(p);
  }
}

function filterTags(evt){
  let tags = document.querySelectorAll(".tagView");
  for (let i = 0; i < tags.length; i++) {

    if (evt.target.id === "showAll"){
      tags[i].parentElement.style.display = "";
    }
    else if (tags[i].innerHTML === evt.target.id){
      tags[i].parentElement.style.display = "";
    }
    else {
      tags[i].parentElement.style.display = "none";
    }
  }
}


//Updates done-status for list
async function setListDone(listId, done){
  try {
    let url = 'app/list/updateList';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        newvalue: done,
        column: "done"
      })
    });
    let data = await response.json();

  }
  catch(err){
    console.log(err);
  }

}

//delete all items in list (to be able to delete list)
async function deleteAllItemsInList(){
  let listId = localStorage.getItem("listId");

  try {
    let response = await fetch(`app/item/deleteItems/${listId}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();
    await deleteList();
    view();
    usersLists();
  } catch(err) {
    console.log(err);
  }

}

// -----------delete list--------------
async function deleteList(){
  let id = localStorage.getItem("listId");
  let delListResp = document.getElementById("delListResp");
  try {
    let response = await fetch(`app/list/deleteList/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();

    if(data.length === 1){
      localStorage.removeItem("listId");
      delListResp.innerHTML = "Liste " + data[0].id + " slettet";
    }
    else delListResp.innerHTML = "Noe gikk galt..";
  } catch(err){
    console.log(err);
  }
}
