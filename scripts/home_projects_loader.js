// scripts/home_projects_loader.js

document.addEventListener("DOMContentLoaded", function() {
    const featuredProjectListContainer = document.getElementById("featured-project-list");

    if (!featuredProjectListContainer) {
        // Console.log plutôt que warn si c'est normal que l'élément n'existe pas sur certaines pages
        console.log("L'élément #featured-project-list n'a pas été trouvé. Le chargement des projets vedettes est ignoré.");
        return;
    }

    fetch("projects.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(projectsData => {
            // Afficher un maximum de 3 projets vedettes, par exemple.
            // Vous pouvez choisir les projets à afficher ici (ex: les premiers 3, ou ceux marqués comme "featured: true" dans projects.json)
            const featuredProjects = projectsData.slice(0, 3); // Prend les 3 premiers projets

            if (featuredProjects.length === 0) {
                featuredProjectListContainer.innerHTML = `<p class="no-projects-message">Aucun projet vedette à afficher pour le moment.</p>`;
                return;
            }

            featuredProjects.forEach(project => {
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");
                projectCard.dataset.categories = JSON.stringify(project.category); // Utile pour d'éventuels filtres futurs

                let imagesHtml = '';
                // N'afficher que la première image pour la carte vedette sur la page d'accueil
                if (project.images && project.images.length > 0) {
                    imagesHtml = `<div class="project-images">`;
                    imagesHtml += `<img src="${project.images[0]}" alt="Image du projet ${project.title}">`;
                    imagesHtml += `</div>`;
                }

                let buttonsHtml = `<div class="project-links">`;
                if (project.links && project.links.length > 0) {
                    // Filtrer pour n'afficher que certains liens sur la page d'accueil (ex: démo et github)
                    const linksToShow = project.links.filter(link => link.type === 'live' || link.type === 'github' || link.type === 'youtube');

                    linksToShow.forEach(link => {
                        let btnClass = '';
                        let btnIcon = '';
                        let linkText = link.text || '';

                        switch (link.type) {
                            case 'live':
                                btnClass = 'btn-primary-outline';
                                btnIcon = '<i class="fa-solid fa-desktop"></i>';
                                linkText = linkText || 'Démo Live';
                                break;
                            case 'github':
                                btnClass = 'btn-secondary-outline';
                                btnIcon = '<i class="fa-brands fa-github"></i>';
                                linkText = linkText || 'Code Source (GitHub)';
                                break;
                            case 'youtube':
                                btnClass = 'btn-secondary-outline';
                                btnIcon = '<i class="fa-brands fa-youtube"></i>';
                                linkText = linkText || 'Voir la Vidéo';
                                break;
                            // N'incluez pas le bouton 'order' ici si vous ne voulez pas qu'il apparaisse sur les cartes vedettes
                        }

                        buttonsHtml += `
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn ${btnClass}">
                                ${btnIcon} ${linkText}
                            </a>
                        `;
                    });
                }
                // Si le projet est "orderable" et que vous voulez le bouton commander sur la page d'accueil
                if (project.orderable) {
                    buttonsHtml += `
                        <button class="btn btn-primary order-project-btn" data-project-title="${project.title}">
                            <i class="fas fa-shopping-cart"></i> Commander
                        </button>
                    `;
                }
                buttonsHtml += `</div>`;


                projectCard.innerHTML = `
                    <div class="project-header">
                        <h3>${project.title}</h3>
                        <div class="project-tags">
                            ${project.tags && project.tags.length > 0 ?
                                project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                        </div>
                    </div>
                    <div class="project-content">
                        <p>${project.description}</p>
                        ${imagesHtml}
                        </div>
                    ${buttonsHtml}
                `;
                featuredProjectListContainer.appendChild(projectCard);
            });

            // Attacher les écouteurs d'événements aux boutons "Commander" APRÈS que les projets soient rendus
            featuredProjectListContainer.querySelectorAll(".order-project-btn").forEach(button => {
                button.addEventListener("click", function() {
                    const projectTitle = this.dataset.projectTitle;
                    if (window.openOrderModal) {
                        window.openOrderModal(projectTitle);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement des projets vedettes:", error);
            featuredProjectListContainer.innerHTML = `<p class="error-message">Impossible de charger les projets vedettes pour le moment.</p>`;
        });
});
