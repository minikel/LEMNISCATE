// scripts/home.js

document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------------------------------
    // Charger les projets mis en avant depuis projects.json
    // ----------------------------------------------------
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const projectContainer = document.getElementById("featured-projects");
            if (projectContainer) { // Vérifier si l'élément existe sur la page
                // Prendre les 3 premiers projets ou moins s'il y en a moins de 3
                const featuredProjects = data.slice(0, Math.min(3, data.length)); 

                featuredProjects.forEach(project => {
                    let projectCard = document.createElement("div");
                    projectCard.classList.add("project-card"); // Assurez-vous d'avoir ce style

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
                    projectContainer.appendChild(projectCard);
                });

                // Attacher les écouteurs d'événements pour les boutons "Commander" sur la page d'accueil
                projectContainer.querySelectorAll(".order-project-btn").forEach(button => {
                    button.addEventListener("click", function() {
                        const projectTitle = this.dataset.projectTitle;
                        // Utilise la fonction globale définie dans main.js
                        if (window.openOrderModal) { 
                            window.openOrderModal(projectTitle);
                        }
                    });
                });
            }
        })
        .catch(error => console.error("Error loading featured projects:", error));

    // ----------------------------------------------------
    // Charger les articles mis en avant depuis articles.json
    // ----------------------------------------------------
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            const articleContainer = document.getElementById("featured-articles");
            if (articleContainer) { // Vérifier si l'élément existe sur la page
                // Prendre les 3 premiers articles ou moins s'il y en a moins de 3
                const featuredArticles = data.slice(0, Math.min(3, data.length));

                featuredArticles.forEach(article => {
                    let articleCard = document.createElement("div");
                    articleCard.classList.add("article-card"); // Assurez-vous d'avoir ce style

                    articleCard.innerHTML = `
                        <img src="${article.image}" alt="${article.title}">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <div class="article-meta">
                            <span class="article-date">${article.date}</span>
                            <span class="article-category">${article.category}</span>
                        </div>
                        <a href="${article.link}" class="btn btn-primary-outline">Lire l'article</a>
                    `;
                    articleContainer.appendChild(articleCard);
                });
            }
        })
        .catch(error => console.error("Error loading featured articles:", error));
});
