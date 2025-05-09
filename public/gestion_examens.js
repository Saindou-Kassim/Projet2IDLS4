function formaterDate(dateString) {
    const options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('fr-FR', options);
}

function escapeHtml(unsafe) {
    unsafe = unsafe || '';
    return unsafe.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': "&amp;",
            '<': "&lt;",
            '>': "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return escape[match];
    });
}

window.addEventListener('DOMContentLoaded', () => {
    chargerExamens();
});

function chargerExamens() {
    fetch('http://localhost:3000/examens')
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erreur HTTP : ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Données des examens reçues : ", data);
            const espaceHtml = document.querySelector('#examens-list tbody');
            espaceHtml.innerHTML = '';

            if (data.length === 0) {
                alert('Aucun examen disponible');
                return;
            }

            data.forEach(examen => {
                const tr = document.createElement('tr');
                const lien = `http://localhost:3000/examens/${examen._id}`;

                tr.innerHTML = `
                    <td data-label="Titre">${escapeHtml(examen.titre)}</td>
                    <td data-label="Description">${escapeHtml(examen.description)}</td>
                    <td data-label="Public ciblé">${escapeHtml(examen.public || '')}</td>
                    <td data-label="Date">${formaterDate(examen.date)}</td>
                    <td data-label="Lien d'accès">
                        <input type="text" value="${lien}" id="lien-${examen._id}" readonly style="opacity:0; position:absolute; left:-9999px;">
                        <button onclick="copierLien('${examen._id}')">Copier le lien</button>
                    </td>
                    <td data-label="Actions">
                        <button class="edit" onclick='afficherFormulaireModification(this, {
                            "_id": "${examen._id}",
                            "titre": "${escapeHtml(examen.titre)}",
                            "description": "${escapeHtml(examen.description)}",
                            "public": "${escapeHtml(examen.public || '')}"
                        })'>Modifier</button>
                        <button class="delete" onclick="supprimerExamen('${examen._id}')">Supprimer</button>
                    </td>
                `;
                espaceHtml.appendChild(tr);
            });
        })
        .catch(err => {
            console.error('Erreur lors de la récupération des examens:', err);
            alert("Erreur lors de la récupération des examens");
        });
}

function genererLien(id) {
    const lien = `http://localhost:3000/examens/${id}`;
    document.getElementById("lien-examen").value = lien;
}

function copierLien(id) {
    const input = document.getElementById(`lien-${id}`);
    input.type = 'text'; 
    input.select();
    input.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(input.value)
        .then(() => alert("Lien copié !"))
        .catch(err => alert("Erreur de copie : " + err));
}



function supprimerExamen(id) {
    if (confirm("Voulez-vous vraiment supprimer cet examen ?")) {
        fetch(`http://localhost:3000/examens/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    chargerExamens();
                } else {
                    throw new Error('Erreur lors de la suppression');
                }
            })
            .catch(err => console.error("Erreur lors de la suppression :", err));
    }
}

function afficherFormulaireModification(button, examen) {
    const ancienFormulaire = document.querySelector('.formulaire-modification');
    if (ancienFormulaire) ancienFormulaire.remove();

    const ligne = button.closest('tr');
    if (!ligne) return;

    const formulaireLigne = document.createElement('tr');
    formulaireLigne.classList.add('formulaire-modification');

    formulaireLigne.innerHTML = `
        <td colspan="6">
            <form onsubmit="mettreAJourExamen(event, '${examen._id}', this)">
                <input type="text" name="titre" value="${escapeHtml(examen.titre)}" placeholder="Titre" required>
                <input type="text" name="description" value="${escapeHtml(examen.description)}" placeholder="Description" required>
                <input type="text" name="public" value="${escapeHtml(examen.public || '')}" placeholder="Public visé">
                <button type="submit">Enregistrer</button>
                <button type="button" onclick="this.closest('tr').remove()">Annuler</button>
            </form>
        </td>
    `;
    ligne.parentNode.insertBefore(formulaireLigne, ligne.nextSibling);
}

function mettreAJourExamen(event, id, form) {
    event.preventDefault();

    const data = {
        titre: form.titre.value,
        description: form.description.value,
        public: form.public.value
    };

    fetch(`http://localhost:3000/examens/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                chargerExamens();
            } else {
                throw new Error("Erreur serveur");
            }
        })
        .catch(err => console.error("Erreur lors de la mise à jour :", err));
}
