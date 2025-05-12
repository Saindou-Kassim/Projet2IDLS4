 

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
    const file = document.getElementById("fileQCM")?.files[0];
    const note = document.getElementById("noteQCM").value;
    const duree = document.getElementById("dureeQCM").value;
 
   //mon ajout
   if (!note || !duree) {
  alert("Veuillez remplir les champs de note et de durée.");
  return;
}
// Convertir les valeurs en nombres (optionnel mais peut éviter des erreurs)
formData.append("note", parseFloat(note));
formData.append("duree", parseInt(duree, 10));

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
   // formData.append("note", note);
    //formData.append("duree", duree);
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
// moi modifier ici
  fetch(`/examens/${examenId}/questions`, {
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
 
}
 