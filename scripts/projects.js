document.addEventListener("DOMContentLoaded", function () {
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
                        <a href="#" class="btn order-btn">Order</a>
                    </div>
                `;

                projectContainer.appendChild(projectCard);
            });

            // Récupération des éléments du formulaire
            let orderModal = document.getElementById("order-form");
            let closeOrderBtn = orderModal.querySelector(".close-btn");
            let fullNameInput = document.getElementById("full-name");
            let emailInput = document.getElementById("email");
            let phoneInput = document.getElementById("phone");
            let submitOrder = document.getElementById("submit-order");

            let currentProjectTitle = "";

            // Associer chaque bouton Order au bon projet
            document.querySelectorAll(".order-btn").forEach(button => {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    let card = this.closest(".project-card");
                    currentProjectTitle = card.querySelector("h3").textContent;
                    orderModal.style.display = "block";
                });
            });

            // Fermer la fenêtre modale
            closeOrderBtn.addEventListener("click", () => {
                orderModal.style.display = "none";
            });

            // Gestion de la soumission du formulaire
            submitOrder.addEventListener("click", function () {
                let name = fullNameInput.value.trim();
                let email = emailInput.value.trim();
                let phone = phoneInput.value.trim();

                if (name && email && phone) {
                    orderModal.style.display = "none";

                    let message = `
Nouvelle demande de service reçue :

Projet : ${currentProjectTitle}
Nom complet : ${name}
Email : ${email}
Téléphone : ${phone}
`;

                    // Simule l’envoi d’email via mailto
                    window.location.href = `mailto:nikelsonmichel?subject=Demande%20de%20service%20pour%20${encodeURIComponent(currentProjectTitle)}&body=${encodeURIComponent(message)}`;

                    alert("Nous avons reçu votre demande et nous vous repondrons dans moins de 60 minutes. Un grand Merci !");

                    // Réinitialiser les champs
                    fullNameInput.value = "";
                    emailInput.value = "";
                    phoneInput.value = "";
                } else {
                    alert("Merci de remplir tous les champs.");
                }
            });
        })
        .catch(error => console.error("Error loading projects:", error));
});
