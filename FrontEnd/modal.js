// **********FENETRE MODALE******************
const modalContent = document.getElementById("modalContent");
const modalGallery = document.querySelector(".modalGallery");
//Variables pour l'affichage de la deuxieme mmodale partie
const buttonAddPhoto = document.querySelector(".container-button button");
const modalPortfolio = document.querySelector(".modalPortfolio");
const modalAddWorks = document.querySelector(".modalAddWorks");
//Variables Pour le form
const formAddWorks = document.querySelector("#formAddWorks");
const labelFile = document.querySelector("#formAddWorks label");
const paragraphFile = document.querySelector("#formAddWorks p");
const inputTitle = document.querySelector("#title");
const inputCategory = document.querySelector("#categoryInput");
const inputFile = document.querySelector("#file");
const previewImage = document.getElementById("previewImage");
// Fonction pour sélectionner l'élément dynamique
function selectDynamicElement() {
  const buttonModal = document.querySelector("#portfolio .div-edit span");
  // console.log(buttonModal);
  buttonModal.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
    displayWorksModal();
    displayModalAddWorks();
  });
}
// création des balises et injection des donnés a partir du fetchWorks
function createWorkModal(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id;
  // trash.id = work.id;
  img.src = work.imageUrl;
  img.alt = work.title;
  span.appendChild(trash);
  figure.appendChild(img);
  figure.appendChild(span);
  modalGallery.appendChild(figure);
}
function displayWorksModal() {
  modalGallery.innerHTML = "";
  getWorks().then((works) => {
    // console.log(works);
    works.forEach((work) => {
      createWorkModal(work);
    });
    deleteWork();
  });
}
// ***************Ajout*******************
/* affichage des works dans le dom */
function displayWorksGallery() {
  myGallery.innerHTML = "";
  const token = localStorage.getItem("token");
  if (token) {
    // Utilisateur connecté : mettre à jour la galerie normalement
    getWorks().then((data) => {
      data.forEach((work) => {
        createGallery(work);
      });
    });
  } else {
    // Utilisateur non connecté : ne rien faire, car la galerie doit rester vide
    console.log("Vous devez être connecté pour afficher la galerie.");
  }
}
// ***********Fin Ajout*********************
//Fermuture de la modal quand on clique sur le croix
const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
xmarkModal.addEventListener("click", () => {
  modalContent.style.display = "none";
});

//fonction d'affichage au click sur btn:"ajouter-photo" de la modalAddWorks(2eme fenetre modal)
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none";
    modalAddWorks.style.display = "flex";
  });
}
//Fermuture de la modal sur la croix 2
const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
xmarkModal2.addEventListener("click", () => {
  //Supréssion de la prewiew a clik sur retour dans la modale
  inputFile.value = "";
  previewImage.style.display = "none";
  modalContent.style.display = "none";
});
const token = localStorage.getItem("token");
// .***********************************************************************************
//Supression des works grace a la méthode DELETE & au Token user depuis la poubelle de la modale
git;
const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can");
  trashs.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      const workID = trash.id;
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du travail avec ID ${workID}`);
          }
          // Supprimer de la galerie principale uniquement si la photo est trouvée
          removeWorkFromGallery(workID);
          // Mettre à jour la galerie principale
          displayWorksGallery();
          // Supprimer de la galerie modale uniquement si l'utilisateur est connecté
          const token = localStorage.getItem("token");
          if (token) {
            removeWorkFromModalGallery(workID);
            displayWorksModal();
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du travail :", error);
        });
    });
  });

  function removeWorkFromGallery(workID) {
    // Supprimer l'élément de la galerie principale par son ID
    const galleryElement = document.querySelector(`.gallery figure img[src='${workID}']`);
    if (galleryElement) {
      galleryElement.parentElement.remove();
    }
  }

  function removeWorkFromModalGallery(workID) {
    // Supprimer l'élément de la galerie modale par son ID
    const modalGalleryElement = document.querySelector(`.modalGallery figure img[src='${workID}']`);
    if (modalGalleryElement) {
      modalGalleryElement.parentElement.remove();
    }
  }
}
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(".modalAddWorks .fa-arrow-left");
  arrowLeftModalWorks.addEventListener("click", () => {
    //Supréssion de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    // console.log("coucou");
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}
returnToModalPortfolio();
function addWorks() {
  // console.log("Adding works...");
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault();
    // Récupération des Valeurs du Formulaire
    const formData = new FormData(formAddWorks);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du fichier");
        }
        return response.json();
      })
      .then((data) => {
        // Vérifier si la photo n'est pas déjà présente dans la galerie principale
        const galleryElement = document.querySelector(`#gallery figure img[src='${data.imageUrl}']`);
        if (!galleryElement) {
          // Si elle n'est pas présente, ajoutez-la à la galerie principale
          createGallery(data);
          addWorkToGallery(data);
        }
        // Reset the form
        formAddWorks.reset();
        // Hide modal and preview
        modalPortfolio.style.display = "flex";
        modalAddWorks.style.display = "none";
        previewImage.style.display = "none";
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  });
}

addWorks();
function addWorkToGallery(work) {
  // console.log("Adding work to gallery:", work);
  // Vérifie si l'élément existe déjà dans la galerie principale
  const existingElement = document.querySelector(`#gallery figure img[src='${work.imageUrl}']`);

  if (!existingElement) {
    // Créer et ajouter la nouvelle œuvre à la galerie principale
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);
    document.getElementById("gallery").appendChild(figure);
  }
}
//Fonction qui génère les catégorie dynamiquement pour la modale (menue deroulante)
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categorys = await getCategories();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
displayCategoryModal();
//fonction prévisualisation de l'image
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        labelFile.style.display = "none";
        paragraphFile.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });
}
prevImg();
// fontion qui vérifie si tout les inputs sont remplis
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(".container-button-add-work  button");
  formAddWorks.addEventListener("input", () => {
    if (!inputTitle.value == "" && !inputFile.files[0] == "") {
      buttonValidForm.classList.remove("button-add-work");
      buttonValidForm.classList.add("buttonValidForm");
    } else {
      buttonValidForm.classList.remove("buttonValidForm");
      buttonValidForm.classList.add("button-add-work");
    }
  });
}
verifFormCompleted();

function showFirstModal() {
  // Fermer la deuxième fenêtre modale
  modalAddWorks.style.display = "none";

  // Afficher à nouveau la première fenêtre modale
  modalPortfolio.style.display = "flex";

  // Mettre à jour la galerie dans la première fenêtre modale
  displayWorksModal();
}

// Ajout d'un gestionnaire d'événements pour le bouton de soumission du formulaire d'ajout de photo
formAddWorks.addEventListener("submit", (e) => {
  e.preventDefault();
  // Traitement pour ajouter la photo ici
  addWorks();
  // Après avoir ajouté avec succès la photo, afficher à nouveau la première fenêtre modale avec la galerie mise à jour
  showFirstModal();
});