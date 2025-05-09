
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');  

if (id) {
    fetch(`http://localhost:3000/examens/${id}`) 
        .then(res => {
            if (!res.ok) throw new Error("Examen non trouvé");
            return res.json(); 
        })
        .then(data => {
            const container = document.getElementById("contenu-examen");
            container.innerHTML = `
                <h2>${data.titre}</h2>
                <p><strong>Description :</strong> ${data.description}</p>
                <p><strong>Public :</strong> ${data.public}</p>
            `;
        })
        .catch(err => {
            document.getElementById("contenu-examen").innerHTML = `<p style="color:red;">Erreur : ${err.message}</p>`;
        });
} else {
    console.error("ID manquant dans l'URL");
}
