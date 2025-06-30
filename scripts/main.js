// scripts/main.js

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // GESTION DU MENU HAMBURGER (Commun à toutes les pages)
    // ----------------------------------------------------
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Icône X
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Icône hamburger
            }
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    // ----------------------------------------------------
    // EFFET DE SCROLL SUR LE HEADER (Commun à toutes les pages)
    // ----------------------------------------------------
    const header = document.querySelector(".main-header");
    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        });
    }

    // ----------------------------------------------------
    // GESTION DE LA MODALE DE COMMANDE (Présente sur Projects, mais logique globale)
    // ----------------------------------------------------
    const orderModal = document.getElementById("order-modal");
    const closeBtn = orderModal ? orderModal.querySelector(".close-btn") : null;
    const formOrder = document.getElementById("form-order");
    const projectTitleInput = formOrder ? formOrder.querySelector("input[name='projectTitle']") : null;

    if (orderModal && closeBtn && formOrder && projectTitleInput) {
        closeBtn.addEventListener("click", () => {
            orderModal.style.display = "none";
            formOrder.reset();
        });

        window.addEventListener("click", (event) => {
            if (event.target === orderModal) {
                orderModal.style.display = "none";
                formOrder.reset();
            }
        });

        formOrder.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(formOrder);
            
            fetch(formOrder.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Votre demande a bien été reçue ! Nous vous répondrons dans les plus brefs délais.");
                    formOrder.reset();
                    orderModal.style.display = "none";
                } else {
                    response.json().then(data => {
                        if (data.errors) {
                            alert("Erreur: " + data.errors.map(error => error.message).join(", "));
                        } else {
                            alert("Une erreur est survenue lors de l'envoi de votre demande.");
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Erreur réseau ou autre:", error);
                alert("Impossible d’envoyer la demande. Veuillez vérifier votre connexion.");
            });
        });
    }

    // Exportez une fonction pour ouvrir la modale depuis d'autres scripts si nécessaire
    window.openOrderModal = (projectTitle = "") => {
        if (projectTitleInput) {
            projectTitleInput.value = projectTitle;
        }
        if (orderModal) {
            orderModal.style.display = "block";
        }
    };
});
