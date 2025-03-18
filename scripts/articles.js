document.addEventListener("DOMContentLoaded", function() {
    fetch("articles.json")
        .then(response => response.json())
        .then(data => {
            let articleContainer = document.getElementById("article-list");
            data.forEach(article => {
                let articleCard = document.createElement("div");
                articleCard.classList.add("article-card");

                articleCard.innerHTML = `
                    <img src="${article.image}" alt="${article.title}">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.link}" class="btn">Read More</a>
                `;

                articleContainer.appendChild(articleCard);
            });
        })
        .catch(error => console.error("Error loading articles:", error));
});
