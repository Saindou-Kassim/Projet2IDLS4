document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('creerExamen');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const titre = document.getElementById('titre').value; 
        const description = document.getElementById('description').value; 
        const publiccible = document.getElementById('public').value; 

        const data = {
            titre: titre,
            description: description,
            public: publiccible,
        };

        fetch('http://localhost:3000/examens', {
            method: 'POST',
            headers: {
                'content-type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if(response.ok) {
                alert('Examen créé avec succès ! ');
                form.reset();
            }else{
                alert('Erreur lors de la création de l\'examen ');
            }
        })
        .catch(error => {
            console.error('Erreure fetch:', error);
            alert('Erreur serveur');
        });     
    });
});