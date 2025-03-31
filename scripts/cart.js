class ShoppingCart {
    constructor() {
        this.cartContainer = document.getElementById('cart');
        this.cartItemsContainer = document.querySelector('.cart-items');
        this.totalPrice = document.querySelector('.cart-total-price');
        this.cartButton = document.getElementById('cart-button');
        this.cartCount = this.cartButton.querySelector('.cart-count');
        this.cartTotalMini = this.cartButton.querySelector('.cart-total-mini');
        this.cartStatus = this.cartButton.querySelector('.cart-status');
        
        this.items = [];
        this.total = 0;

        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load saved cart
        // Load cart immediately when instance is created
        this.loadCart();
        this.updateTotal();

        // Add page unload handler
        window.addEventListener('beforeunload', () => {
            this.saveCart();
        });
        
        // Make the instance globally accessible
        window.cartInstance = this;
    }

    initializeEventListeners() {
        // Add to cart buttons
        this.attachCartButtonListeners();

        // Cart toggle
        this.cartButton.addEventListener('click', () => {
            this.cartContainer.classList.add('active');
        });

        // Close cart
        document.querySelector('.cart-close').addEventListener('click', () => {
            this.cartContainer.classList.remove('active');
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.cartContainer.contains(e.target) && 
                !this.cartButton.contains(e.target) && 
                this.cartContainer.classList.contains('active')) {
                this.cartContainer.classList.remove('active');
            }
        });
    }
    
    // New method to attach event listeners to cart buttons
    attachCartButtonListeners(container = document) {
        container.querySelectorAll('.buttoncarrito').forEach(button => {
            // Remove any existing listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new listener
            newButton.addEventListener('click', (e) => this.addToCart(e));
        });
    }

    addToCart(e) {
        const product = e.target.closest('.product');
        if (!product) return;
    
        const price = parseFloat(product.getAttribute('data-price'));
        if (isNaN(price)) return;
    
        // Obtener la URL de la imagen y extraer su nombre
        const imageUrl = product.querySelector('img').src;
        const imageName = imageUrl.split('/').pop();
    
        const item = {
            id: Date.now(),
            image: imageUrl,
            imageName: imageName, // Se almacena el nombre de la imagen
            name: product.querySelector('h3').textContent.trim(),
            price: price,
            quantity: 1
        };
    
        // Se compara usando el nombre de la imagen
        const existingItem = this.items.find(i => i.imageName === item.imageName);
        if (existingItem) {
            existingItem.quantity++;
            this.updateCartItem(existingItem);
        } else {
            this.items.push(item);
            this.addCartItem(item);
        }
    
        this.updateTotal();
        this.saveCart();
        this.cartContainer.classList.add('active');
    }
    

    addCartItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <div class="cart-item-remove">&times;</div>
        `;

        this.cartItemsContainer.appendChild(itemElement);
        this.setupCartItemEvents(itemElement, item);
    }

    setupCartItemEvents(itemElement, item) {
        const minusBtn = itemElement.querySelector('.minus');
        const plusBtn = itemElement.querySelector('.plus');
        const removeBtn = itemElement.querySelector('.cart-item-remove');

        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                this.updateCartItem(item);
                this.updateTotal();
                this.saveCart();
            }
        });

        plusBtn.addEventListener('click', () => {
            item.quantity++;
            this.updateCartItem(item);
            this.updateTotal();
            this.saveCart();
        });

        removeBtn.addEventListener('click', () => {
            this.items = this.items.filter(i => i.id !== item.id);
            itemElement.remove();
            this.updateTotal();
            this.saveCart();
        });
    }

    updateCartItem(item) {
        const itemElement = this.cartItemsContainer.querySelector(`[data-id="${item.id}"]`);
        if (itemElement) {
            itemElement.querySelector('.cart-item-quantity span').textContent = item.quantity;
        }
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Update total displays
        this.totalPrice.textContent = `$${this.total.toFixed(2)}`;
        this.cartTotalMini.textContent = `$${this.total.toFixed(2)}`;
        
        // Update item count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = `${totalItems} items`;
        
        // Update cart status indicator
        this.cartStatus.classList.toggle('active', this.items.length > 0);
    }

    saveCart() {
        // Save both items and total
        const cartData = {
            items: this.items,
            total: this.total,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('angelSportCart', JSON.stringify(cartData));
    }

    loadCart() {
        const savedCart = localStorage.getItem('angelSportCart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                this.items = cartData.items || [];
                this.total = cartData.total || 0;

                // Clear existing items in DOM
                this.cartItemsContainer.innerHTML = '';
                
                // Rebuild cart items in DOM
                this.items.forEach(item => this.addCartItem(item));
                this.updateTotal();
            } catch (e) {
                console.error('Error loading cart:', e);
                this.items = [];
                this.total = 0;
                localStorage.removeItem('angelSportCart');
            }
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});