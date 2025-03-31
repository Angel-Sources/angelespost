document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalPrice = document.querySelector('.modal-price');
    const closeBtn = document.querySelector('.close-modal');
    const modalAddToCartBtn = modal.querySelector('.buttoncarrito');
    
    let currentProduct = null;

    // Función para abrir el modal
    function openModal(product) {
        currentProduct = product;
        modalImage.src = product.querySelector('img').src;
        modalTitle.textContent = product.querySelector('h3').textContent;
        
        // Get the description paragraph (not the price paragraph)
        const paragraphs = product.querySelectorAll('p');
        let descText = '';
        for (let p of paragraphs) {
            if (!p.classList.contains('price')) {
                descText = p.textContent;
                break;
            }
        }
        modalDescription.textContent = descText;
        
        // Get the price
        modalPrice.textContent = product.querySelector('.price').textContent;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('modal-show');
        }, 10);
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('modal-show');
        setTimeout(() => {
            modal.style.display = 'none';
            currentProduct = null;
        }, 300);
    }

    // Use event delegation to handle clicks on product images
    document.addEventListener('click', function(event) {
        // Check if the clicked element is a product image
        if (event.target.matches('.product img')) {
            const product = event.target.closest('.product');
            openModal(product);
        }
    });

    // Event listener for the modal's "Agregar al carrito" button
    modalAddToCartBtn.addEventListener('click', function() {
        if (currentProduct && window.cartInstance) {
            // Create a simulated event with the current product as the target's parent
            const simulatedEvent = {
                target: {
                    closest: function(selector) {
                        if (selector === '.product') {
                            return currentProduct;
                        }
                        return null;
                    }
                }
            };
            
            // Call the addToCart method with our simulated event
            window.cartInstance.addToCart(simulatedEvent);
            
            // Optional: Close the modal after adding to cart
            closeModal();
        } else {
            console.error('Cannot add to cart: currentProduct or cartInstance is missing');
        }
    });

    // Event listeners para cerrar
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Prevenir que el click en el contenido del modal lo cierre
    modal.querySelector('.modal-content').addEventListener('click', function(event) {
        event.stopPropagation();
    });
});