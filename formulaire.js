document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("inscriptionForm").addEventListener("submit", function(event) {
        event.preventDefault(); 

        
        const typeUtilisateur = document.getElementById("typeUtilisateur").value;
        const sexe = document.getElementById("sexe").value;
        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const email = document.getElementById("email").value;
        const naissance = document.getElementById("naissance").value;
        const etablissement = document.getElementById("etablissement").value;
        const filiere = document.getElementById("filiere").value;

        
        const userData = {
            typeUtilisateur: typeUtilisateur,
            sexe: sexe,
            nom: nom,
            prenom: prenom,
            email: email,
            naissance: naissance,
            etablissement: etablissement,
            filiere: filiere
        };

        
        fetch("http://localhost:3000/inscription", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Réponse du serveur incorrecte');
            }
            return response.json(); 
        })
        .then(data => {
            
            alert(data.message); 
        })
        .catch(error => {
            console.error("Erreur:", error); 
            alert("Une erreur est survenue, veuillez réessayer.");
        });
    });
});
