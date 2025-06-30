// scripts/articles.js

document.addEventListener("DOMContentLoaded", function() {
    fetch("articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let articleContainer = document.getElementById("article-list");
            if (articleContainer) { // Vérifier si l'élément existe sur la page
                articleContainer.innerHTML = ''; // Nettoyer avant d'ajouter
                data.forEach(article => {
                    let articleCard = document.createElement("div");
                    articleCard.classList.add("article-card");

                    articleCard.innerHTML = `
                        <img src="${article.image}" alt="${article.title}">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <div class="article-meta">
                            <span class="article-date">${article.date}</span>
                            <span class="article-category">${article.category}</span>
                        </div>
                        <a href="${article.link}" class="btn btn-primary-outline" target="_blank" rel="noopener noreferrer">Lire l'article</a>
                    `;
                    articleContainer.appendChild(articleCard);
                });
            }
        })
        .catch(error => {
            console.error("Error loading articles:", error);
            const articleContainer = document.getElementById("article-list");
            if (articleContainer) {
                articleContainer.innerHTML = `<p class="error-message">Impossible de charger les articles pour le moment. Veuillez réessayer plus tard.</p>`;
            }
        });
});
