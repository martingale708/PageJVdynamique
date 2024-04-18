// VARIABLES
let myGallery = document.querySelector(".gallery");
let myFigures = document.querySelectorAll(".gallery figure");
const sectionPortfolioH2 = document.querySelector("#portfolio h2");
const sectionPortfolio = document.querySelector("#portfolio");
// console.log(sectionPortfolio)
const adminText = "Mode édition";
const adminLogo = `<i class="fa-regular fa-pen-to-square"></i>`;
const adminConexionUP = `<div class="admin-edit">
<p>${adminLogo}${adminText}</p>
</div>`;
const divEdit = document.createElement("div");
const spanEdit = document.createElement("span");
const adminConexionDown = `${adminLogo}  ${adminText} `;

// RECUPERATION DES WORKS
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// CREATION DES BALISES HTML/AFFICHAGE DANS LE DOM
async function getGallery() {
  const works = await getWorks();
}
function clearGallery() {
  myGallery.innerHTML = "";
}

getGallery();
//CREATION DE LA GALLERIE
async function createGallery(work) {
  const figure = document.createElement("figure");
  // creation de la balise image
  const img = document.createElement("img");
  img.setAttribute("src", work.imageUrl);
  img.setAttribute("alt", work.title);
  // creation de la balise figcaption
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  myGallery.appendChild(figure);
}
// RECUPERATION DES CATEGORIES
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
  
}

// CREATION DES BOUTONS PAR CATEGORIES
async function getCategoryButtons() {
  try {
    const categories = await getCategories();

    // Verifier si la div existe déjà
    let newDiv = document.getElementById("myFilterId");

    // Si elle n'existe pas, la créer
    if (!newDiv) {
      newDiv = document.createElement("div");
      newDiv.classList.add("myFilterClass"); // Ajout de la classe
      newDiv.id = "myFilterId"; // Ajout de l'id
      const h2Element = document.querySelector("#portfolio > h2");
      h2Element.insertAdjacentElement("afterend", newDiv);

      // création du bouton TOUS
      const buttonTous = document.createElement("button");
      buttonTous.textContent = "TOUS";
      buttonTous.classList.add("btn");
      buttonTous.id = "0";
      newDiv.appendChild(buttonTous);

      // création des boutons par catégories
      categories.forEach((nameCategory) => {
        const button = document.createElement("button");
        button.textContent = nameCategory.name;
        button.id = nameCategory.id;
        button.classList.add("btn");
        newDiv.appendChild(button);
      });
    }
    return newDiv;
  } catch (error) {
    console.error("Error:", error);
  }
}

// FILTRAGE AU CLICK DES BOUTONS PAR CATEGORIES
async function filterCategory() {
  try {
    const works = await getWorks();
    // console.log("Gallerys:", works);

    const buttons = document.querySelectorAll("#myFilterId button");
    // console.log("Buttons:", buttons);

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const buttonId = e.target.id;
        // console.log("Button Clicked:", buttonId);
        // Ajoute la classe "selected" au bouton actuellement cliqué
        e.target.classList.toggle("selected");
        // Supprime la classe "selected" des autres boutons
        buttons.forEach((otherButton) => {
          if (otherButton !== e.target) {
            otherButton.classList.remove("selected");
          }
        });
        clearGallery();
        if (buttonId == "0" || buttonId == "TOUS") {
          works.forEach((work) => {
            createGallery(work);
          });
        } else {
          // Filtrer par catégorie si un bouton spécifique est cliqué
          const filterGallery = works.filter((work) => {
            return work.categoryId == buttonId;
          });
          // console.log("Filtered Works:", filterGallery);

          filterGallery.forEach((filteredWork) => {
            createGallery(filteredWork);
          });
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Utilisation de la fonction getCategoryButtons
getCategoryButtons().then((newDiv) => {
  // console.log(newDiv);
  filterCategory(); // Aoppelle la fonction filterCategory quand  newDiv est crée
});
document.addEventListener("DOMContentLoaded", async function () {
  await getCategoryButtons();
  //  getCategoryButtons();
  const loginStatus = document.querySelector(".users");
  // console.log(loginStatus);
  const logoutStatus = document.querySelector("#logout");
  // console.log(logoutStatus);
  const newDiv = document.querySelector("#myFilterId");
  // **********CONNEXION*******************
  //l'utilisateur est connecté
  if (localStorage.getItem("token") && localStorage.getItem("userId") !== null) {
    //creation dynamiquement du bouton Modifiezr
    document.body.insertAdjacentHTML("afterbegin", adminConexionUP);
    spanEdit.innerHTML = adminConexionDown;
    divEdit.classList.add("div-edit");
    // Ajoute d'abord sectionPortfolioH2, puis spanEdit
    divEdit.appendChild(sectionPortfolioH2);
    divEdit.appendChild(spanEdit);
    sectionPortfolio.prepend(divEdit);
    // Définit la marge inférieure de sectionPortfolioH2 à 0
    sectionPortfolioH2.style.marginBottom = "0";
    loginStatus.style.display = "none";
    logoutStatus.style.display = "block";
    if (newDiv) {
      newDiv.style.display = "none";
    }
    // Appeler selectDynamicElement ici
    selectDynamicElement();
  } else {
    loginStatus.style.display = "block";
    logoutStatus.style.display = "none";
  }

  // Pour se déconnecter

  document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    // Supprimez les éléments du stockage local
    localStorage.removeItem("userId");
    localStorage.removeItem("token");

    // Masquez les éléments liés à la session connectée
    document.querySelector(".admin-edit").style.display = "none";
    document.querySelector("#portfolio .div-edit span").style.display = "none";
    // Affichez les éléments liés à la session déconnectée
    loginStatus.style.display = "block";
    logoutStatus.style.display = "none";

    // Redirigez l'utilisateur vers la page principale
    location.href = "index.html";
  
  })
});
