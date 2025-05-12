// Ajoute dynamiquement des options pour le QCM
/*function addOption() {
  const container = document.getElementById("optionsContainer");
  const index = container.children.length;

  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Option ${index + 1}" class="option">
    <label>
      <input type="checkbox" class="bonne-reponse" value="${index}"> Bonne réponse
    </label>
  `;
  document.getElementById("bonneReponseContenair").appendChild(div.cloneNode(true));
  container.appendChild(div);
}

// Affiche ou cache les formulaires selon le type choisi
function toggleFields() {
  const type = document.getElementById("questionType").value;
  document.getElementById("formQCM").style.display = type === "qcm" ? "block" : "none";
  document.getElementById("formDirecte").style.display = type === "directe" ? "block" : "none";
}

// Envoie les données au serveur
function enregistrerQuestion(type) {
  const formData = new FormData();
  const examenId = localStorage.getItem("examenId"); // Tu dois stocker l’ID de l’examen au chargement

  formData.append("type", type);
  formData.append("examenId", examenId);

  if (type === "qcm") {
    const question = document.getElementById("questionQCM").value;
    const note = document.getElementById("note").value;
    const duree = document.getElementById("duree").value;
    const fichier = document.getElementById("fileQCM").files[0];

    const options = Array.from(document.getElementsByClassName("option")).map(input => input.value);
    const bonnesReponses = Array.from(document.getElementsByClassName("bonne-reponse"))
                                .filter(input => input.checked)
                                .map(input => {
                                  const index = Array.from(document.getElementsByClassName("bonne-reponse")).indexOf(input);
                                  return options[index];
                                });

    formData.append("question", question);
    formData.append("reponses", JSON.stringify(options));
    formData.append("reponseCorrecte", JSON.stringify(bonnesReponses));
    formData.append("note", note);
    formData.append("duree", duree);
    if (fichier) formData.append("file", fichier);

  } else if (type === "directe") {
    const question = document.getElementById("questionDirecte").value;
    const reponseAttendue = document.getElementById("reponseDirecte").value;
    const tolerance = document.getElementById("tolerance").value;
    const fichier = document.getElementById("fileDirecte").files[0];

    formData.append("question", question);
    formData.append("reponseAttendue", reponseAttendue);
    formData.append("tolerance", tolerance);
    formData.append("note", 1); // Si tu veux une valeur par défaut
    formData.append("duree", 60); // Valeur par défaut ou à ajouter dans le formulaire
    if (fichier) formData.append("file", fichier);
  }

  fetch("http://localhost:3000/api/questions", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert("Question enregistrée avec succès !");
    window.location.reload(); // Rafraîchit la page après soumission
  })
  .catch(error => {
    console.error("Erreur lors de l'envoi de la question :", error);
    alert("Erreur lors de l'enregistrement !");
  });
}*/










/*document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour basculer entre les champs QCM et Directe
    window.toggleFields = function () {
        const type = document.getElementById("questionType").value;
        const formQCM = document.getElementById("formQCM");
        const formDirecte = document.getElementById("formDirecte");

        if (type === "qcm") {
            formQCM.style.display = "block";
            formDirecte.style.display = "none";
        } else {
            formQCM.style.display = "none";
            formDirecte.style.display = "block";
        }
    };

    // Fonction pour ajouter dynamiquement une option QCM
    window.addOption = function () {
        const optionsContainer = document.getElementById("optionsContainer");

        // Conteneur pour une option
        const optionItem = document.createElement("div");
        optionItem.classList.add("option-item");

        // Champ de texte pour l'option
        const newOption = document.createElement("input");
        newOption.type = "text";
        newOption.placeholder = "Saisir une option";
        newOption.classList.add("option-input");

        // Case à cocher pour indiquer si l'option est correcte
        const correctCheckbox = document.createElement("input");
        correctCheckbox.type = "checkbox";
        correctCheckbox.classList.add("option-correct");

        // Label pour la case à cocher
        const correctLabel = document.createElement("label");
        correctLabel.textContent = " Réponse attendue ?";
        correctLabel.appendChild(correctCheckbox);

        // Ajouter les éléments au conteneur de l'option
        optionItem.appendChild(newOption);
        optionItem.appendChild(correctLabel);

        // Ajouter le conteneur de l'option au formulaire
        optionsContainer.appendChild(optionItem);
    };

    // Fonction pour enregistrer une question
    window.enregistrerQuestion = function (type) {
        // Récupération de l'examId depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get("examId");

        if (!examId) {
            alert("Identifiant de l'examen introuvable dans l'URL.");
            return;
        }

        if (type === "qcm") {
            // Récupération des champs pour une question QCM
            const question = document.getElementById("questionQCM").value.trim();
            const note = document.getElementById("note").value.trim();
            const duree = document.getElementById("duree").value.trim();

            // Récupération des options
            const options = Array.from(document.getElementsByClassName("option-item")).map(item => {
                return {
                    text: item.querySelector(".option-input").value.trim(),
                    isCorrect: item.querySelector(".option-correct").checked,
                };
            });

            // Récupérer uniquement les réponses attendues (correctes)
            const reponsesAttendues = options
                .filter(option => option.isCorrect)
                .map(option => option.text);

            // Vérification des champs requis
            if (!question || options.length < 2 || !note || !duree) {
                alert("Veuillez remplir tous les champs requis pour une question QCM.");
                return;
            }

            if (reponsesAttendues.length === 0) {
                alert("Veuillez sélectionner au moins une réponse attendue.");
                return;
            }

            // Préparation des données pour l'envoi
            const data = {
                type,
                examenId: examId,
                question,
                reponses: options.map(opt => opt.text),
                reponsesAttendues,
                note,
                duree,
            };

            // Envoi des données au backend
            fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    alert(result.message || "Question ajoutée avec succès !");
                })
                .catch(error => console.error('Erreur:', error));
        } else if (type === "directe") {
            // Récupération des champs pour une question directe
            const question = document.getElementById("questionDirecte").value.trim();
            const reponseAttendue = document.getElementById("reponseAttendue").value.trim();
            const tolerance = document.getElementById("tolerance").value.trim();
            const note = document.getElementById("noteDirecte").value.trim();
            const duree = document.getElementById("dureeDirecte").value.trim();

            // Vérification des champs requis
            if (!question || !reponseAttendue || !tolerance || !note || !duree) {
                alert("Veuillez remplir tous les champs requis pour une question directe.");
                return;
            }

            // Préparation des données pour l'envoi
            const data = {
                type,
                examenId: examId,
                question,
                reponseAttendue,
                tolerance,
                note,
                duree,
            };

            // Envoi des données au backend
            fetch('/api/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    alert(result.message || "Question ajoutée avec succès !");
                })
                .catch(error => console.error('Erreur:', error));
        }
    };
});*/



function toggleFields() {
  const type = document.getElementById("questionType").value;
  document.getElementById("formQCM").style.display = type === "qcm" ? "block" : "none";
  document.getElementById("formDirecte").style.display = type === "directe" ? "block" : "none";
}

// Pour QCM : ajouter une option
function addOption() {
  const optionsContainer = document.getElementById("optionsContainer");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Option";
  input.classList.add("optionQCM");
  optionsContainer.appendChild(input);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("reponseCheckboxQCM");
  //checkbox.value = optionsContainer.children.length / 2 - 1;
  document.getElementById("bonneReponseContenair").appendChild(checkbox);
}



// Fonction principale d’enregistrement
function enregistrerQuestion(type) {
  const examenId = localStorage.getItem("examenId") || new URLSearchParams(window.location.search).get("examId");

  if (!examenId) {
    alert("ID d'examen introuvable !");
    return;
  }

  const formData = new FormData();
  formData.append("type", type);
  formData.append("examenId", examenId);

  if (type === "qcm") {
    const question = document.getElementById("questionQCM")?.value;
    const note = document.getElementById("noteQCM").value;
    const duree = document.getElementById("dureeQCM").value;
    const file = document.getElementById("fileQCM")?.files[0];

    /*const options = Array.from(document.getElementById("optionsContainer").querySelectorAll("input"))
                         .map(input => input.value)
                         .filter(val => val !== "");*/
     const options = Array.from(document.querySelectorAll(".optionQCM")).map(input => input.value);                     

     const bonnesReponses = Array.from(document.querySelectorAll(".reponseCheckboxQCM"))
    .map((checkbox, index) => checkbox.checked ? index : null)
    .filter(index => index !== null);

    if (!question || options.length === 0 || bonnesReponses.length === 0) {
      alert("Veuillez remplir tous les champs du QCM correctement.");
      return;
    }

    formData.append("question", question);
    formData.append("reponses", JSON.stringify(options));
    formData.append("reponseCorrecte", JSON.stringify(bonnesReponses));
    formData.append("note", note);
    formData.append("duree", duree);
    if (file) formData.append("file", file);
  }

  else if (type === "directe") {
    const question = document.getElementById("questionDirecte")?.value;
    const reponse = document.getElementById("reponseDirecte")?.value;
    const tolerance = document.getElementById("tolerance")?.value;
    const file = document.getElementById("fileDirecte")?.files[0];

    const note = 1; // Par défaut, tu peux changer ça
    const duree = 60; // Idem

    if (!question || !reponse) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }

    formData.append("question", question);
    formData.append("reponseAttendue", reponse);
    formData.append("tolerance", tolerance);
    formData.append("note", note);
    formData.append("duree", duree);
    if (file) formData.append("file", file);
  }

  fetch("/questions", {
  method: "POST",
  body: formData,
})
  .then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Erreur serveur");
    }
    return res.json();
  })
  .then((data) => {
    alert("Question enregistrée avec succès !");
    window.location.reload();
  })
  .catch((err) => {
    console.error("Erreur:", err);
    alert("Erreur lors de l'enregistrement : " + err.message);
  });


  /*fetch("/questions", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Question enregistrée avec succès !");
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur lors de l'enregistrement de la question.");
    });*/
}



/*
document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour basculer entre les champs QCM et directe
    window.toggleFields = function () {
        const type = document.getElementById("questionType").value;
        const formQCM = document.getElementById("formQCM");
        const formDirecte = document.getElementById("formDirecte");

        if (type === "qcm") {
            formQCM.style.display = "block";
            formDirecte.style.display = "none";
        } else {
            formQCM.style.display = "none";
            formDirecte.style.display = "block";
        }
    };

    // Fonction pour ajouter dynamiquement une option QCM avec case à cocher
    window.addOption = function () {
        const optionsContainer = document.getElementById("optionsContainer");

        // Conteneur pour une option
        const optionItem = document.createElement("div");
        optionItem.classList.add("option-item");

        // Champ de texte pour l'option
        const newOption = document.createElement("input");
        newOption.type = "text";
        newOption.placeholder = "Saisir une option";
        newOption.classList.add("option-input");

        // Case à cocher pour indiquer si l'option est correcte
        const correctCheckbox = document.createElement("input");
        correctCheckbox.type = "checkbox";
        correctCheckbox.classList.add("option-correct");

        // Label pour la case à cocher
        const correctLabel = document.createElement("label");
        correctLabel.textContent = " Correct ?";
        correctLabel.appendChild(correctCheckbox);

        // Ajouter les éléments au conteneur de l'option
        optionItem.appendChild(newOption);
        optionItem.appendChild(correctLabel);

        // Ajouter le conteneur de l'option au formulaire
        optionsContainer.appendChild(optionItem);
    };

    window.enregistrerQuestion = function (type) {
    // Récupération de l'examId depuis l'URL
    const examenId = localStorage.getItem("examenId") || new URLSearchParams(window.location.search).get("examId");

    if (!examId) {
        alert("Identifiant de l'examen introuvable dans l'URL.");
        return;
    }

    const formData = new FormData(); // pour l'envoi de fichiers

    formData.append("type", type);
    formData.append("examenId", examenId);

    if (type === "qcm") {
        // Récupération des champs pour une question QCM
        const question = document.getElementById("questionQCM").value.trim();
        const note = document.getElementById("note").value.trim();
        const duree = document.getElementById("duree").value.trim();
        const fileInput = document.getElementById("fileQCM");

        // Récupération des options
        const options = Array.from(document.getElementsByClassName("option-item")).map(item => {
            return {
                text: item.querySelector(".option-input").value.trim(),
                isCorrect: item.querySelector(".option-correct").checked,
            };
        });

         // Récupérer uniquement les réponses attendues (correctes)
            const reponses = options.map(opt => opt.text);
            const reponsesCorrecte = options.filter(opt => opt.isCorrect).map(opt => opt.text);

            // Vérification des champs requis
        if (!question || options.length < 2 || !note || !duree) {
            alert("Veuillez remplir tous les champs requis pour une question QCM.");
            return;
        }

        
            formData.append("type", type);
            formData.append("examenId", examId);
            formData.append("question", question);
            formData.append("reponses", JSON.stringify(reponses));
            formData.append("reponsesCorrecte", JSON.stringify(reponsesCorrecte));
            formData.append("note", note);
            formData.append("duree", duree);

            if (fileInput && fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
        }


    }     



    if (type === "directe") {
        // Récupération des champs pour une question directe
        const question = document.getElementById("questionDirecte").value.trim();
        const reponseAttendue = document.getElementById("reponseDirecte").value.trim();
        const tolerance = document.getElementById("tolerance").value.trim();
        const note = document.getElementById("noteDirecte").value.trim();
        const duree = document.getElementById("dureeDirecte").value.trim();
        const fileInput = document.getElementById("fileDirecte");
        // Vérification des champs requis
        if (!question || !reponseAttendue || !tolerance || !note || !duree) {
            alert("Veuillez remplir tous les champs requis pour une question directe.");
            return;
        }

        // Préparation des données pour l'envoi
    
        formData.append("type", type);
        formData.append("examenId", examId);
        formData.append("question", question);
        formData.append("reponseAttendue", reponseAttendue);
        formData.append("tolerance", tolerance);
        formData.append("note", note);
        formData.append("duree", duree);

        if (fileInput && fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
        }

    }    


    fetch('/questions', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                alert(result.message);
            } else {
                alert("Erreur lors de l'ajout de la question.");
            }
        })
         .catch(error => {
        console.error('Erreur:', error);
        alert("Erreur serveur. Vérifiez la console.");
    });

   
    };

});  */  
/*fetch('/questions', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    alert(result.message);
                } else {
                    alert("Erreur lors de l'ajout de la question.");
                }
            })
            .catch(error => console.error('Erreur:', error));*/




