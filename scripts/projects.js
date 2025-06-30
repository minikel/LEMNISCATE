// scripts/projects.js

document.addEventListener("DOMContentLoaded", function() {
    // ----------------------------------------------------
    // GESTION DES PROJETS (Chargement depuis projects.json)
    // ----------------------------------------------------
    const projectListContainer = document.getElementById("project-list");

    if (projectListContainer) { // S'exécute seulement si #project-list existe
        fetch("projects.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(projectsData => {
                projectListContainer.innerHTML = ''; // Nettoyer avant d'ajouter

                projectsData.forEach(project => {
                    const projectCard = document.createElement("div");
                    projectCard.classList.add("project-card");

                    let buttonsHtml = `
                        <div class="project-buttons">
                            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                                <i class="fab fa-github"></i> GitHub
                            </a>` : ''}
                    `;
                    const demoLink = project.liveDemoLink || project.demo;
                    if (demoLink && demoLink !== "#") {
                         buttonsHtml += `
                            <a href="${demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                                <i class="fas fa-eye"></i> Démo Live
                            </a>
                         `;
                    }

                    if (project.orderable) {
                        buttonsHtml += `
                            <button class="btn btn-download order-project-btn" data-project-title="${project.title}">
                                <i class="fas fa-shopping-cart"></i> Commander
                            </button>
                        `;
                    }
                    buttonsHtml += `</div>`;


                    projectCard.innerHTML = `
                        <img src="${project.image}" alt="Image du projet : ${project.title}">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.tags && project.tags.length > 0 ? 
                                project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                        ${buttonsHtml}
                    `;
                    projectListContainer.appendChild(projectCard);
                });

                // Attacher les écouteurs d'événements aux boutons "Commander" APRÈS que les projets soient rendus
                projectListContainer.querySelectorAll(".order-project-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        const projectTitle = this.dataset.projectTitle;
                        // Utilise la fonction globale définie dans main.js
                        if (window.openOrderModal) { 
                            window.openOrderModal(projectTitle);
                        }
                    });
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement des projets:", error);
                projectListContainer.innerHTML = `<p class="error-message">Impossible de charger les projets pour le moment. Veuillez réessayer plus tard.</p>`;
            });
    }
});
