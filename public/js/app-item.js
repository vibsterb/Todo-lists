//-----------Add Item-------------------
async function addItem(evt){
  evt.preventDefault();

  let item = document.getElementById("listItem").value;
  document.getElementById("listItem").value = "";
  let itemResp = document.getElementById("itemResp");

  try {

    let url = 'app/item';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        itemName: item,
        listId: localStorage.getItem("listId")
      })
    });
    let data = await response.json();

    if (data){
      showItems();
    }
    else{
      itemResp.innerHTML = "Something went wrong";
    }
  }
  catch(err){
  }
}

//show items in list
async function showItems(){
  let listId = localStorage.getItem("listId");
  let itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";
  unique_tags = [];

  try {
    let response = await fetch(`app/items/${listId}`, {
      method: "GET",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();

    if(data){
      let checkCounter = 0;
      let alertMessage = "";
      let tags = [];
      for(let i in data){
        let div = document.createElement("div");
        div.id = data[i].name;
        div.classList.add("items");
        div.classList.add("importance" + data[i].importance);

        let label = document.createElement("label");
        label.setAttribute("for", data[i].name+i);
        label.innerHTML = data[i].name;

        let tagView = document.createElement("span");
        tagView.innerHTML = data[i].tag;
        tagView.classList.add("tagview");
        if(data[i].tag){
          tags.push(data[i].tag);
        }

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = data[i].name+i;

        if(data[i].checked){
          checkBox.checked = true;
          checkCounter++;
        }
        checkBox.onclick = setChecked;

        let iconDiv = document.createElement("div");
        iconDiv.classList.add("iconDiv");
        iconDiv.id = data[i].name;
        if(localStorage.getItem("icons") === 'hidden'){
          iconDiv.style.display = "none";
        }

        let del = document.createElement("span");
        del.innerHTML = " X ";
        del.id = data[i].name;
        del.title = "Delete item";
        del.onclick = deleteItem;
        del.classList.add("itemDelete");

        let setTag = document.createElement("span");
        setTag.innerHTML = " # ";
        setTag.title = "Tag item";
        setTag.onclick = itemDetails;
        setTag.classList.add("itemTag");

        let importance = document.createElement("span");
        importance.innerHTML = " !!! ";
        importance.title = "Set Importance ";
        importance.id = data[i].name;
        importance.onclick = setImportance;
        importance.classList.add("itemImp");

        iconDiv.appendChild(del);
        iconDiv.appendChild(setTag);
        iconDiv.appendChild(importance);

        div.appendChild(label);
        div.appendChild(checkBox);
        div.appendChild(tagView);
        div.appendChild(iconDiv);
        itemsContainer.appendChild(div);

        if(checkCounter === data.length){
          setListDone(listId, true);
        }
        else {
          setListDone(listId, false);
        }

        for (let i in tags) {
          if (unique_tags.indexOf(tags[i]) === -1) {
            unique_tags.push(tags[i]);
          }
        }
      }
    }
  } catch(err) {
    console.log(err);
  }
}

//------------------Checkbox----------------
async function setChecked(evt){
  let checked =evt.target.checked;
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.parentElement.id;

  try {
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: checked,
        column: 'checked'
      })
    });
    let data = await response.json();
    showItems();
  }
  catch(err){

  }
}

//------------------Update item tag-------------
function itemDetails(evt){

  if(document.getElementById("newVal")){
    removeInput("newVal", "tag");
  }

  let input = document.createElement("input");
  let button = document.createElement("button");

  input.id ="newVal";
  button.id ="tag";
  button.innerHTML="Tag Item";
  button.classList.add("btnMedium");
  button.onclick = updateItem;

  evt.target.parentElement.appendChild(input);
  evt.target.parentElement.appendChild(button);
}

async function updateItem(evt){
  let newValue = document.getElementById("newVal").value;
  let column = evt.target.id;
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.parentElement.id;

  try {
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: newValue,
        column: column
      })
    });
    let data = await response.json();

    removeInput("newVal", "tag");
    showItems();

  }
  catch(err){

  }

}

// remove extra input fields
function removeInput(elem1, elem2){
  document.getElementById(elem1).remove();
  document.getElementById(elem2).remove();

}

//----------------item importance---------------------
function setImportance(evt){

  if(document.getElementById("0")){
    removeInput("0", "1");
    removeInput("2", "3");
  }

  let scale = ["None","Low","Medium","High"];

  for(let i = 0; i < 4; i++) {
    let btn = document.createElement("button");
    btn.id = i;
    btn.innerHTML = scale[i];
    btn.classList.add("btnSmall");
    btn.onclick = updateImp;
    evt.target.parentElement.appendChild(btn);
  }

}

async function updateImp(evt){
  let importance = evt.target.id;
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.parentElement.id;

  try {
    let url = 'app/item/updateItem';
    let response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      },
      body: JSON.stringify({
        listid: listId,
        name: itemName,
        newvalue: importance,
        column: 'importance'
      })
    });
    let data = await response.json();

    showItems();

  }
  catch(err){
    console.log(err);

  }
}

//delete one item in list
async function deleteItem(evt){
  let listId = localStorage.getItem("listId");
  let itemName = evt.target.id;
  try {
    let response = await fetch(`/app/item/deleteItem/${listId}/${itemName}`, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });
    let data = await response.json();
    showItems();
  }
  catch(err){
    console.log(err);
  }
}
