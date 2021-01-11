"use strict"

let updSettings = document.getElementById("settings");
updSettings.onclick = settingsMenu;


function settingsMenu(){
  addTemplate("settingsTemplate");

  //henter alle bilder
  getImageDirectory();

}

async function getImageDirectory(){
  let user = JSON.parse(localStorage.getItem("user"));

  try {
    let url = 'app/file/dir';
    let response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-access-token": localStorage.getItem("token")
      }
    });

    let data = await response.json();
    if(data){
    showGallery(data);
    }
  } catch(err){

  }

}

function showGallery(dir){

    let gallery = document.getElementById("imageGallery");

    for(let i in dir.children){
      let path = dir.children[i].path.substr(7);
      //let id = dir.children[i].name.substr(0, dir.children[i].name.indexOf('.'));
      let id = dir.children[i].name;
      let div = document.createElement("div");
      let img = document.createElement("img");

      div.id = id;
      div.onclick = changeBackground;
      img.classList.add("smallImg");
      img.src = path;
      div.appendChild(img);
      gallery.appendChild(div);
    }
}

//endrer bakgrunnsbilde
function changeBackground(evt){
  document.body.style.backgroundImage = "url(" + evt.target.src + ")";
  let listId = localStorage.getItem("listId");
  if(listId){
    setListImage(listId, evt.target.parentElement.id)
  }
}

//saves new image for list
async function setListImage(listId, image){
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
        newvalue: image,
        column: "image"
      })
    });
    let data = await response.json();

  }
  catch(err){
    console.log(err);
  }

}
