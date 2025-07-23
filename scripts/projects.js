// scripts/projects.js

document.addEventListener("DOMContentLoaded", function() {
    const projectListContainer = document.getElementById("project-list");
    const categoryFiltersContainer = document.getElementById("category-filters");

    let allProjects = []; // Variable pour stocker tous les projets une fois chargés
    let activeCategory = "all"; // Catégorie active par défaut

    // Fonction pour charger les projets depuis projects.json
    function fetchProjects() {
        if (!projectListContainer) {
            console.warn("L'élément #project-list n'a pas été trouvé. Le chargement des projets est annulé.");
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
                allProjects = projectsData; // Stocker les données globalement
                generateCategoryFilters(allProjects); // Générer les boutons de filtre
                renderProjects(allProjects, activeCategory); // Rendre tous les projets initialement
            })
            .catch(error => {
                console.error("Erreur lors du chargement des projets:", error);
                projectListContainer.innerHTML = `<p class="error-message">Impossible de charger les projets pour le moment. Veuillez réessayer plus tard.</p>`;
            });
    }

    // Fonction pour générer les boutons de filtre de catégorie
    function generateCategoryFilters(projects) {
        if (!categoryFiltersContainer) {
            console.warn("L'élément #category-filters n'a pas été trouvé. Les filtres ne seront pas générés.");
            return;
        }

        // Extraire les catégories uniques
        const categories = new Set();
        projects.forEach(project => {
            // Assurez-vous que project.category est un tableau
            if (Array.isArray(project.category)) {
                project.category.forEach(cat => categories.add(cat));
            } else if (typeof project.category === 'string') {
                // Si la catégorie est une chaîne simple, l'ajouter directement
                categories.add(project.category);
            }
        });

        // Ajouter le bouton "Tous"
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.classList.add("filter-btn", "active"); // Actif par défaut
        allButton.dataset.category = "all";
        categoryFiltersContainer.appendChild(allButton);

        // Ajouter les autres boutons de catégorie
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category;
            button.classList.add("filter-btn");
            button.dataset.category = category;
            categoryFiltersContainer.appendChild(button);
        });

        // Ajouter les écouteurs d'événements aux boutons de filtre
        categoryFiltersContainer.querySelectorAll(".filter-btn").forEach(button => {
            button.addEventListener("click", function() {
                // Mettre à jour la catégorie active
                activeCategory = this.dataset.category;

                // Mettre à jour les classes "active"
                categoryFiltersContainer.querySelectorAll(".filter-btn").forEach(btn => {
                    btn.classList.remove("active");
                });
                this.classList.add("active");

                // Rendre les projets filtrés
                renderProjects(allProjects, activeCategory);
            });
        });
    }

    // Fonction pour rendre les projets dans le conteneur
    function renderProjects(projects, filter) {
        projectListContainer.innerHTML = ''; // Nettoyer le conteneur avant de rendre

        const filteredProjects = projects.filter(project => {
            // Assurez-vous que project.category est un tableau pour la méthode includes
            if (!Array.isArray(project.category)) {
                return filter === "all" || project.category === filter; // Gérer le cas où category est une chaîne simple
            }
            return filter === "all" || project.category.includes(filter);
        });


        if (filteredProjects.length === 0) {
            projectListContainer.innerHTML = `<p class="no-projects-message">Aucun projet trouvé pour cette catégorie.</p>`;
            return;
        }

        filteredProjects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            // Les catégories sont ajoutées comme data-attributs pour une éventuelle utilisation future (par exemple, animations de filtre)
            projectCard.dataset.categories = JSON.stringify(project.category);

            // Construction dynamique du contenu HTML de la carte
            let imagesHtml = '';
            if (project.images && project.images.length > 0) {
                imagesHtml = `<div class="project-images">`;
                project.images.forEach(imgSrc => {
                    imagesHtml += `<img src="${imgSrc}" alt="Image du projet ${project.title}">`;
                });
                imagesHtml += `</div>`;
            }

            let detailsHtml = '';
            if (project.details && project.details.length > 0) {
                detailsHtml += `<div class="project-details">`;
                project.details.forEach(detail => {
                    detailsHtml += `<p>${detail}</p>`;
                });
                detailsHtml += `</div>`;
            }

            let mediaEmbedHtml = '';
            // Rechercher un lien YouTube dans le tableau 'links'
            const youtubeLink = project.links ? project.links.find(link => link.type === 'youtube') : null;

            if (youtubeLink) {
                // Assurez-vous que l'URL d'incorporation est correcte
                mediaEmbedHtml = `
                    <div class="video-embed-container">
                        <iframe src="${youtubeLink.url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <p class="video-caption">${youtubeLink.text || "Démonstration vidéo du projet."}</p>
                `;
            }

            let buttonsHtml = `<div class="project-links">`;
            if (project.links && project.links.length > 0) {
                project.links.forEach(link => {
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
                            // Le lien YouTube est déjà géré par mediaEmbedHtml, ce bouton est optionnel
                            // S'il est présent, il ouvrira la vidéo dans une nouvelle fenêtre/onglet
                            btnClass = 'btn-secondary-outline';
                            btnIcon = '<i class="fa-brands fa-youtube"></i>';
                            linkText = linkText || 'Voir la Vidéo';
                            break;
                        case 'order': // Gérer le type 'order' si vous l'avez dans le tableau links
                             btnClass = 'btn-primary order-project-btn'; // Utilisez une classe spécifique pour le bouton commander
                             btnIcon = '<i class="fa-solid fa-cart-shopping"></i>';
                             linkText = linkText || 'Commander';
                             break;
                        default:
                            btnClass = 'btn-secondary-outline';
                            btnIcon = '<i class="fa-solid fa-link"></i>'; // Icône générique
                    }

                    // Pour le bouton commander, nous ne créons pas un lien <a> mais un <button>
                    if (link.type === 'order') {
                        buttonsHtml += `
                            <button class="btn ${btnClass}" data-project-title="${project.title}">
                                ${btnIcon} ${linkText}
                            </button>
                        `;
                    } else {
                        buttonsHtml += `
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn ${btnClass}">
                                ${btnIcon} ${linkText}
                            </a>
                        `;
                    }
                });
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
                    ${detailsHtml}
                    ${mediaEmbedHtml}
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
    }

    // Lancer le chargement des projets au démarrage
    fetchProjects();
});
