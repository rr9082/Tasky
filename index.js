const taskContainer = document.querySelector(".task_container");

const taskModal = document.querySelector(".task__modal__body");

let globalTaskData = [];
//array to store the task data

const generateHTML = (taskData) =>
    `<div id="${taskData.id}" class="col-md-6 col-lg-4 mt-4  mb-4">
        <div class="card">
        <div class="card-header d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-outline-primary" name=${taskData.id} onclick="editCard.apply(this,arguments)">
          <i class="fal fa-pencil " name=${taskData.id}></i></button>
          <button type="button" class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this,arguments)">
          <i class="fal fa-trash "  name=${taskData.id} ></i></button>
        </div>
        <div class="card-body">
          <img src="${taskData.image}" alt="image" class="card-img">
          <h5 class="card-title mt-4"> ${taskData.title}</h5>
          <p class="card-text">${taskData.description}</p>
          <span class="badge bg-primary "> ${taskData.type}</span>
        </div>
        <div class="card-footer ">
          <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-bs-target="#showTask" name=${taskData.id} onclick="openTask.apply(this, arguments)" id="${taskData.id}">Open Task</button>
        </div> 
        
        </div>
      </div>`;

const htmlModalContent = ({ id, title, description, url }) => {
    console.log(id);
    console.log(title);
    const date = new Date(parseInt(id));

    return ` <div id=${id}>
        
         <img
         src=${
             url ||
             `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
         }
         alt="bg image"
         class="img-fluid place__holder__image mb-3"
         />
         <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
         <h2 class="my-3">${title}</h2>
         <p class="lead">
         ${description}
         </p></div>`;
};
const insertToDOM = (newcard) =>
    taskContainer.insertAdjacentHTML("beforeend", newcard);

//update local storage
const saveToLocalStorage = () =>
    localStorage.setItem("tasky", JSON.stringify({ cards: globalTaskData }));

const addNewCard = () => {
    //get data
    const taskData = {
        id: `${Date.now()}`,
        title: document.getElementById("taskTitle").value,
        image: document.getElementById("imageURL").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,
    };

    globalTaskData.push(taskData);
    console.log(globalTaskData);
    //update local storage
    saveToLocalStorage();

    //generate html code

    const newcard = generateHTML(taskData);
    //inject to DOM
    insertToDOM(newcard);

    //clear the form
    document.getElementById("taskTitle").value = "";
    document.getElementById("imageURL").value = "";
    document.getElementById("taskType").value = "";
    document.getElementById("taskDescription").value = "";

    return;
};
//funtion to execute onload
const loadExistingCards = () => {
    //check local storage
    const getdata = localStorage.getItem("tasky");

    //parse json data, it exists
    if (!getdata) return;

    const taskCards = JSON.parse(getdata);

    globalTaskData = taskCards.cards;

    globalTaskData.map((taskData) => {
        //generate HTML
        const newcard = generateHTML(taskData);

        //inject to DOM
        insertToDOM(newcard);
    });
    return;
};

const deleteCard = (event) => {
    const targetId = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    const removeTask = globalTaskData.filter((task) => task.id !== targetId);
    globalTaskData = removeTask;

    saveToLocalStorage(); //update to local storage

    //access dom to remove card
    if (elementType === "BUTTON") {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode
        );
    } else {
        return taskContainer.removeChild(
            event.target.parentNode.parentNode.parentNode.parentNode
        );
    }
};

const editCard = (event) => {
    const targetId = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    let taskTitle;
    let taskType;
    let taskDescription;
    let parentElement;
    let submitButton;

    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    taskTitle = parentElement.childNodes[3].childNodes[3];
    taskDescription = parentElement.childNodes[3].childNodes[5];
    taskType = parentElement.childNodes[3].childNodes[7];
    submitButton = parentElement.childNodes[5].childNodes[1];

    console.log(taskTitle, taskDescription, taskType);

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.innerHTML = "Save Changes";
};

//contenteditable = true (users can edit)

const saveEdit = (event) => {
    const targetId = event.target.getAttribute("name");
    const elementType = event.target.tagName;

    let parentElement;

    if (elementType === "BUTTON") {
        parentElement = event.target.parentNode.parentNode;
    } else {
        parentElement = event.target.parentNode.parentNode.parentNode;
    }
    const taskTitle = parentElement.childNodes[3].childNodes[3];
    const taskDescription = parentElement.childNodes[3].childNodes[5];
    const taskType = parentElement.childNodes[3].childNodes[7];
    const submitButton = parentElement.childNodes[5].childNodes[1];

    const updatedData = {
        title: taskTitle.innerHTML,
        type: taskType.innerHTML,
        description: taskDescription.innerHTML,
    };

    const updateGlobalTask = globalTaskData.map((task) => {
        if (task.id === targetId) {
            return { ...task, ...updatedData };
        }
        return task;
    });
    globalTaskData = updateGlobalTask;

    saveToLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.innerHTML = "Open Task";
};

const openTask = (e) => {
    if (!e) e = window.event;
    const getTask = globalTaskData.filter(({ id }) => id === e.target.id);
    console.log(getTask[0]);
    const newmod = htmlModalContent(getTask[0]);
    taskModal.insertAdjacentHTML("beforeend", newmod);
};
