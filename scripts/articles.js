// scripts/articles.js

document.addEventListener("DOMContentLoaded", () => {
    const articleListContainer = document.getElementById("article-list");
    const categoryTabs = document.querySelector(".category-tabs");
    let allArticles = []; // Pour stocker tous les articles chargés

    // Fonction pour charger et afficher les articles
    const fetchAndDisplayArticles = async (filterCategory = "all") => {
        if (allArticles.length === 0) { // Charger les articles une seule fois
            try {
                const response = await fetch('articles.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allArticles = await response.json();
                // Assurez-vous que les articles sont triés du plus récent au plus ancien si nécessaire
                allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error("Erreur lors du chargement des articles:", error);
                articleListContainer.innerHTML = "<p>Impossible de charger les articles pour le moment. Veuillez réessayer plus tard.</p>";
                return;
            }
        }

        // Filtrer les articles
        const filteredArticles = allArticles.filter(article => {
            if (filterCategory === "all") {
                return true; // Afficher tous les articles
            }
            // Vérifie si la catégorie de l'article (qui peut être une chaîne avec plusieurs catégories)
            // contient la catégorie sélectionnée, en ignorant la casse et en nettoyant les espaces.
            const articleCategories = article.category.split(',').map(cat => cat.trim().toLowerCase());
            return articleCategories.includes(filterCategory.toLowerCase());
        });

        // Afficher les articles filtrés
        displayArticles(filteredArticles);
    };

    // Fonction pour afficher un ensemble d'articles donné
    const displayArticles = (articles) => {
        articleListContainer.innerHTML = ''; // Nettoie le contenu précédent

        if (articles.length === 0) {
            articleListContainer.innerHTML = "<p>Aucun article trouvé dans cette catégorie.</p>";
            return;
        }

        articles.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            articleCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}">
                <div class="article-info">
                    <span class="article-category">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <div class="article-meta">
                        <span class="article-date"><i class="far fa-calendar-alt"></i> ${article.date}</span>
                    </div>
                    <a href="${article.link}" class="btn btn-secondary">Lire l'article</a>
                </div>
            `;
            articleListContainer.appendChild(articleCard);
        });
    };

    // Gérer les clics sur les onglets de catégorie
    if (categoryTabs) {
        categoryTabs.addEventListener("click", (event) => {
            if (event.target.classList.contains("tab-button")) {
                // Supprimer la classe 'active' de tous les boutons
                document.querySelectorAll(".tab-button").forEach(button => {
                    button.classList.remove("active");
                });

                // Ajouter la classe 'active' au bouton cliqué
                event.target.classList.add("active");

                const selectedCategory = event.target.dataset.category;
                fetchAndDisplayArticles(selectedCategory); // Charger les articles filtrés
            }
        });
    }

    // Charger les articles par défaut (tous les articles) au chargement de la page
    fetchAndDisplayArticles("all");
});
