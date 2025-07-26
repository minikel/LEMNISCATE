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
            // Bascule la classe 'active' sur le bouton lui-même pour des styles CSS supplémentaires
            menuToggle.classList.toggle("active"); 

            // Gère le changement d'icône fa-bars <-> fa-times
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
                // S'assure de retirer la classe 'active' du bouton pour réinitialiser l'icône et les styles
                menuToggle.classList.remove("active"); 
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
    // Vérifiez si formOrder existe avant de tenter de sélectionner projectTitleInput
    const projectTitleInput = formOrder ? formOrder.querySelector("input[name='projectTitle']") : null;

    // S'assure que tous les éléments nécessaires à la modale existent avant d'ajouter les écouteurs d'événements
    if (orderModal && closeBtn && formOrder && projectTitleInput) {
        closeBtn.addEventListener("click", () => {
            orderModal.style.display = "none";
            formOrder.reset(); // Réinitialise le formulaire
        });

        window.addEventListener("click", (event) => {
            if (event.target === orderModal) {
                orderModal.style.display = "none";
                formOrder.reset(); // Réinitialise le formulaire
            }
        });

        formOrder.addEventListener("submit", function(e) {
            e.preventDefault(); // Empêche le comportement de soumission par défaut du formulaire

            const formData = new FormData(formOrder);
            
            fetch(formOrder.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json' // Indique que nous attendons une réponse JSON
                }
            })
            .then(response => {
                if (response.ok) {
                    alert("Votre demande a bien été reçue ! Nous vous répondrons dans les plus brefs délais.");
                    formOrder.reset(); // Réinitialise le formulaire après succès
                    orderModal.style.display = "none"; // Ferme la modale
                } else {
                    // Tente de lire les erreurs du serveur si la réponse n'est pas OK
                    response.json().then(data => {
                        if (data.errors) {
                            alert("Erreur: " + data.errors.map(error => error.message).join(", "));
                        } else {
                            alert("Une erreur est survenue lors de l'envoi de votre demande.");
                        }
                    }).catch(() => {
                        // Si la réponse n'est pas un JSON valide mais toujours une erreur
                        alert("Une erreur est survenue lors de l'envoi de votre demande (réponse non JSON).");
                    });
                }
            })
            .catch(error => {
                console.error("Erreur réseau ou autre:", error);
                alert("Impossible d’envoyer la demande. Veuillez vérifier votre connexion.");
            });
        });
    } else {
        // Optionnel: Log pour savoir si les éléments de la modale ne sont pas trouvés
        console.log("Éléments de la modale de commande non trouvés. La logique de la modale ne sera pas initialisée.");
    }

    // Exportez une fonction pour ouvrir la modale depuis d'autres scripts si nécessaire
    // Cette fonction est rendue accessible globalement via l'objet window
    window.openOrderModal = (projectTitle = "") => {
        if (projectTitleInput) {
            projectTitleInput.value = projectTitle; // Pré-remplit le titre du projet
        }
        if (orderModal) {
            orderModal.style.display = "block"; // Affiche la modale
        } else {
            console.warn("La modale de commande n'a pas été trouvée pour ouvrir.");
        }
    };
});
