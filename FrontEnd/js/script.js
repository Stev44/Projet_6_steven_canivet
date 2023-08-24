/***** fonction de récupération dans l'API *****/

function takeWorks() {
    return fetch('http://localhost:5678/api/works')
        .then(response => response.json())
}

function takeCategories() {
    return fetch('http://localhost:5678/api/categories')
        .then(response => response.json());
}

/**** fonctions pratiques ****/

function linkParent(parent, elementType, classList = [], textContent = '', position = 'beforeend') {
    const element = document.createElement(elementType);
    element.classList.add(...classList);
    element.textContent = textContent;
    parent.insertAdjacentElement(position, element);
    return element;
}

 function showImages(images) {
    const containerImages = document.querySelector('.gallery');
    
    images.forEach(element => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        img.setAttribute('src', element.imageUrl);
        img.setAttribute('alt', element.title);
        img.setAttribute('category', element.categoryId);
        img.setAttribute('crossorigin', 'anonymous');
        figcaption.textContent = element.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        containerImages.appendChild(figure);
    });
}

takeWorks()
 .then(images => showImages(images))


function clearSessionStorage() {
    sessionStorage.clear();
    document.location.href = "login.html";
 }

document.addEventListener("DOMContentLoaded", function() {
 
    if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== "undefined") {

        const btn1 = document.getElementById('btn-1')
        btn1.classList.remove('hideButton');

        const btn2 = document.getElementById('btn-2')
        btn2.classList.remove('hideButton');

        const btn3 = document.getElementById('btn-3')
        btn3.classList.remove('hideButton');

       const modalContainer = document.createElement('div');
       modalCreation(modalContainer);

       console.log('connecté');
       
       let btnLogout = document.getElementById("login").innerHTML = "logout";
       
    }
 });
 
 


function filter(categories) {
    const portfolio = document.getElementById('portfolio');
    const buttons = document.createElement('div');
    buttons.className = 'categories';

    const allBtn = document.createElement('button');
    allBtn.textContent = 'Tous';
    buttons.appendChild(allBtn);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.id = category.id;
        buttons.appendChild(button);
        portfolio.querySelector('h2').insertAdjacentElement('afterend', buttons);

        button.addEventListener('click', function() {
            const id = this.id;
            document.querySelectorAll('.gallery img').forEach(image => {
                if (image.getAttribute('category') === id) {
                    image.parentElement.style.display = 'block';
                } else {
                    image.parentElement.style.display = 'none';
                }
            });
        });
    });

    allBtn.addEventListener('click', function() {
        document.querySelectorAll('.gallery img').forEach(image => {
            image.parentElement.style.display = 'block';
        });
    });
}

function categoriesButton() {
    takeCategories().then(categories => {
        filter(categories);
    });
}

categoriesButton();



function modalCreation() {
    openModal();
    const figure = document.querySelector('#introduction figure');

    const modalContainer = linkParent(figure, 'div', ['modalContainer'], '', 'afterbegin');
    modalContainer.id = 'modal-1';

    const modalStyle = linkParent(modalContainer, 'div', ['modalStyle']);
    const modal = linkParent(modalContainer, 'div', ['modal']);
    const header = linkParent(modal, 'header', ['modalHeader']);
    const heading = linkParent(header, 'h1', ['titleModal'], 'Galerie photo');
    const closeButton = linkParent(header, 'span', ['closeModal'], 'x');
    const arrowModal = linkParent(header, 'i', ['fa-solid', 'fa-arrow-left', 'arrow']);
    const containerModal = linkParent(modal, 'div', ['modalContent']);

    takeWorks()
        .then(donnees => loadImage(donnees));

    const footer = linkParent(modal, 'footer', ['modal-footer']);
    const addButton = linkParent(footer, 'button', ['addButton'], 'Ajouter une photo');

    function openModal() {
    
        const modalButton3 = document.getElementById('btn-3');
        modalButton3.addEventListener("click", (event) => {
            event.preventDefault();
            const modalFirst = document.querySelector(".modalContainer");
            modalFirst.classList.add("active");
        });
    }

    closeButton.addEventListener("click", (e) => {
        e.preventDefault();
        const modalFirst = document.querySelector(".modalContainer");
        modalFirst.classList.remove("active");
        takeWorks()
            .then(donnees => afficherImages(donnees));
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalStyle) {
            event.preventDefault();
            const modalFirst = document.querySelector(".modalContainer");
            modalFirst.classList.remove("active");
        }
    });

    addButton.addEventListener("click", function() {
        const modalContainer = document.querySelector('.modalContent');
        const imagePreview = document.querySelector('.images-preview');
        imagePreview.style.display = "none";
        modalContainer.style.display = 'flex';
        addButton.setAttribute('id', 'addWorks');
        if (!document.getElementById('modalForm')) {
            createForm(modalContainer);
        }
        addButton.style.display = 'none';
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Supprimer la galerie";
    deleteButton.classList.add('deleteButton');
    footer.appendChild(deleteButton);



    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteAll();
    });

    function deleteAll() {

        fetch('http://localhost:5678/api/works', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem("token")
                }
            })
            .then(response => {
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    fetch('http://localhost:5678/api/works/' + item.id, {
                            method: 'DELETE',
                            headers: {
                                Authorization: 'Bearer ' + sessionStorage.getItem("token") 
                            }
                        })
                });
                takeWorks().then(données => {
                    loadImage(données);
                });
            })
    }
    
    arrowModal.addEventListener("click", function() {

        const addButton = document.querySelector('.addButton');
        addButton.style.display = 'block';
        addButton.textContent = "Ajouter une photo";
        
        const arrowModal = document.querySelector('.arrow');
        arrowModal.style.display = "none";

        const title = document.querySelector('.titleModal');
        title.textContent = 'Galerie photo';        

        const deleteButton = document.querySelector('.deleteButton');
        deleteButton.style.display = "block";

        const modalContainer = document.querySelector('.modalContent');
        modalContainer.style.display = "grid";

        takeWorks()
            .then(donnees => loadImage(donnees));
    });
}


function createForm(modalContainer) {
    
    modalContainer.innerHTML = '';
    const form = document.createElement('form');
    form.setAttribute('id', 'modalForm');

    const divInputFile = document.createElement('div');
    divInputFile.classList.add('inputFile');
   
    const iconPicture = document.createElement('i');
    iconPicture.classList.add('fa-sharp', 'fa-solid', 'fa-image', 'pictureIcon', 'fa-xl')
    
    const inputFormFile = document.createElement('input');
    inputFormFile.setAttribute('hidden', '');
    inputFormFile.setAttribute('type', 'file');
    inputFormFile.setAttribute('id', 'image');
    inputFormFile.setAttribute('accept', 'image/png');
    inputFormFile.setAttribute('crossorigin', 'anonymous');
    inputFormFile.setAttribute('name', 'file');
    
    const divInputForm = document.createElement('div');
    divInputForm.classList.add('form-group');

    const divTitle = document.createElement('div');
    divTitle.classList.add('input-titre');

    const labelTitre = document.createElement('label');
    labelTitre.innerText = 'Titre';
    labelTitre.setAttribute('for', 'titre');
    labelTitre.setAttribute('id', 'label-titre');

    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'titre');
    titleInput.setAttribute('name', 'titre');
    titleInput.setAttribute('required', 'true');

   
    const labelCategories = document.createElement('label');
    labelCategories.innerText = 'Catégorie';
    labelCategories.setAttribute('for', 'categories');
    labelCategories.setAttribute('id', 'categories');

    function selector(id) {
        const select = document.createElement('select');
        select.setAttribute('id', id);
        return select;
    }
    
    const selectOption = selector('categorieSelector');
    selectOption.setAttribute('name', 'categoryId');
    
    const validationButton = linkParent(form, 'button', ['validButton'], 'Valider');

    const deleteButton = document.querySelector('.deleteButton');
    deleteButton.style.display = 'none';

    const titleModal = document.querySelector('.titleModal');
    titleModal.textContent = 'Ajout photo';
    
    const arrowModal = document.querySelector('.arrow');
    arrowModal.style.display = 'block';

    const addFile = createButtonFile(divInputFile, inputFormFile);

    const spanInfo = document.createElement('span');
    spanInfo.classList.add('textInfo');
    spanInfo.innerText = 'jpg, png: 4mo max';

    function createImagePreview() {

        const img = document.createElement('img');
        const figure = document.createElement('figure');
        figure.classList.add('windowPreview');
        img.setAttribute('id', 'imagePreview');
        img.style.display = 'none';
        img.style.width = '60%';
        figure.appendChild(img);
        return figure;
    }

    const imagePreview = createImagePreview();

    

    validationButton.addEventListener('click', async (event) => {
        const fileInput = document.getElementById("image"); 
        const titleInput = document.getElementById("titre");
        const categorieSelector = document.getElementById("categorieSelector");
    
        if (!fileInput.value) {
            event.preventDefault();
            alert("Fichier manquant");
          } else if (!titleInput.value) {
            event.preventDefault();
            alert("Titre manquant.");
          } else if (categorieSelector.value < 1) {
            event.preventDefault();
            alert("Catégorie manquante");
          }else{
            addWork();
          }
    });

    modalContainer.appendChild(form);
    form.appendChild(divInputFile);
    divInputFile.appendChild(iconPicture);
    divInputFile.appendChild(inputFormFile);
    divInputFile.appendChild(addFile);
    divInputFile.appendChild(spanInfo);
    form.appendChild(divInputForm);
    divInputForm.appendChild(divTitle);
    divInputForm.appendChild(labelCategories);
    divInputForm.appendChild(selectOption);
    divTitle.appendChild(labelTitre);
    divTitle.appendChild(titleInput);
    form.appendChild(validationButton);

    inputFormFile.addEventListener('change', (event) => {
        inputFormFile.style.display = 'none';

        divInputFile.appendChild(imagePreview);
        const img = imagePreview.querySelector('img');
        const file = event.target.files[0]; 
        const inputImage = document.getElementById("image");
       
        if (file) {
            const load = new FileReader();
            load.addEventListener('load', (event) => {
                inputImage.setAttribute("src", load.result);
                img.src = event.target.result;
                img.style.display = 'block';
            });

            load.readAsDataURL(file);
        }
    });

    const categorySelector = document.querySelector('select');
        fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((categories) => {
        
        const option = document.createElement('option');
        categorySelector.appendChild(option);

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.text = category.name;
            categorySelector.appendChild(option);
        
        });
    })
}

function addWork(){

    const imageInput = document.getElementById('image');
    const imageUrl = imageInput.files[0];
    const title = document.getElementById('titre').value;
    const categoryId = document.getElementById('categorieSelector').value;
    const token = sessionStorage.getItem('token');
    const data = new FormData();
    data.append('title', title);
    data.append('image', imageUrl);
    data.append('category', categoryId);
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: data
    }) 
}

 function createButtonFile(divInputFile, inputFormFile) {
    const addFile = document.createElement('button');
    addFile.classList.add('addButton-photo');
    addFile.innerText = '+ Ajouter photo';
    addFile.addEventListener('click', (e) => {
        e.preventDefault();
        inputFormFile.click();
        const inputFiles = document.querySelector('.inputFile');
        inputFiles.style.paddingTop = '10px'
        inputFiles.style.paddingTop = '10px'
        
        const img = document.querySelector('.pictureIcon');
        const span = document.querySelector('.textInfo');
        addFile.style.display = 'none';
        img.style.display = 'none';
        span.style.display = 'none';
    });
    return addFile;
}

function loadImage(images) {
    const imagesContainer = document.querySelector(".modalContent");
    imagesContainer.innerHTML = "";

    const imageLoad = document.createElement("div");
    imageLoad.classList.add("images-preview");

    images.forEach((element) => {
        const img = document.createElement("img");
        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        img.src = element.imageUrl;
        img.alt = element.title;
        img.setAttribute("data-id", element.id);
        figure.classList.add("figureModal");
        
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid","fa-arrows-up-down-left-right","icon-drag");
        
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash-can");
        
        figcaption.textContent = "éditer";
        figcaption.id = "figcaptionModal";
        
        figure.append(img);
        figure.append(editIcon);
        figure.append(deleteIcon);
        figure.append(figcaption);
        imageLoad.append(figure);
    });

    imagesContainer.append(imageLoad);

    const imagePreview = document.querySelector('.images-preview');
    imagePreview.addEventListener('click', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('fa-trash-can')) {
            const figure = e.target.closest('figure');
            const workId = figure.querySelector('img').dataset.id;
            const token = sessionStorage.getItem('token');

            fetch(`http://localhost:5678/api/works/${workId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
        }
    });
}



