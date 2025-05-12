
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
                <h3>Questions :</h3>
                <div id="questions"></div>
            `;

            const questionsContainer = document.getElementById('questions');
            if (data.type === 'QCM') {
                data.questions.forEach(question => {
                    const qcmQuestion = document.createElement('div');
                    qcmQuestion.innerHTML = `
                        <p><strong>${question.texte}</strong></p>
                        <ul>
                            ${question.options.map(option => `<li><input type="radio" name="qcm-${question._id}" value="${option}">${option}</li>`).join('')}
                        </ul>
                    `;
                    questionsContainer.appendChild(qcmQuestion);
                });
            }else {

                data.questions.forEach(question => {
                    const directQuestion = document.createElement('div');
                    directQuestion.innerHTML = `
                        <p><strong>${question.texte}</strong></p>
                        <input type="text" name="direct-${question._id}" placeholder="Votre réponse...">
                    `;
                    questionsContainer.appendChild(directQuestion);
                });
            }    
        })
        .catch(err => {
            document.getElementById("contenu-examen").innerHTML = `<p style="color:red;">Erreur : ${err.message}</p>`;
        });
} else {
    console.error("ID manquant dans l'URL");
}
