document.addEventListener("DOMContentLoaded", function() {
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            let projectContainer = document.getElementById("project-list");
            data.forEach(project => {
                let projectCard = document.createElement("div");
                projectCard.classList.add("project-card");

projectCard.innerHTML = `
    <img src="${project.image}" alt="${project.title}">
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="project-buttons">
        <a href="${project.demo}" class="btn" target="_blank">View Project</a>
        <a href="order.html" class="btn order-btn" target="_blank">Order your own version</a>
    </div>
`;


                projectContainer.appendChild(projectCard);
            });

            // Gestion du formulaire de téléchargement
            let modal = document.getElementById("download-form");
            let closeBtn = document.querySelector(".close-btn");
            let emailInput = document.getElementById("email");
            let submitEmail = document.getElementById("submit-email");

            document.querySelectorAll(".download-btn").forEach(button => {
                button.addEventListener("click", function() {
                    modal.style.display = "block";
                    submitEmail.dataset.file = this.dataset.file;
                });
            });

            closeBtn.addEventListener("click", () => modal.style.display = "none");

            submitEmail.addEventListener("click", function() {
                let email = emailInput.value.trim();
                if (email) {
                    let file = this.dataset.file;
                    modal.style.display = "none";
                    window.location.href = file;
                    alert("Download started. Thank you!");
                } else {
                    alert("Please enter a valid email address.");
                }
            });
        })
        .catch(error => console.error("Error loading projects:", error));
});
