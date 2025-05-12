fetch('http://localhost:3000/examens')
  .then(response => response.json())
  .then(examens => {
    const container = document.getElementById('examensContainer');
    examens.forEach(examen => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${examen.titre}</h3>
        <p>${examen.description}</p>
        <a href="ajout_questions.html?examenId=${examen._id}">Ajouter une question</a>
      `;
      container.appendChild(div);
    });
  })
  .catch(error => console.error('Erreur lors du chargement des examens :', error));
