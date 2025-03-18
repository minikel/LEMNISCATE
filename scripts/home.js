document.addEventListener("DOMContentLoaded", function () {
    // Charger les projets depuis projects.html
    fetch("projects.html")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const projects = doc.querySelectorAll(".project-card");
            const projectContainer = document.getElementById("featured-projects");

            for (let i = 0; i < Math.min(3, projects.length); i++) {
                projectContainer.appendChild(projects[i].cloneNode(true));
            }
        });

    // Charger les articles depuis articles.html
    fetch("articles.html")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const articles = doc.querySelectorAll(".article-card");
            const articleContainer = document.getElementById("featured-articles");

            for (let i = 0; i < Math.min(3, articles.length); i++) {
                articleContainer.appendChild(articles[i].cloneNode(true));
            }
        });
});
