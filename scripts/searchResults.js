document.addEventListener('DOMContentLoaded', async function() {
    const query = localStorage.getItem('searchQuery').toLowerCase();
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear existing results

    // URLs to fetch HTML content from different pages
    const urls = [
        'limpieza.html',
        'botanas.html',
        'lacteos.html',
        'refrescos.html'
    ];

    // Fetch HTML content from each URL
    const fetchPageContent = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            return await response.text();
        } catch (error) {
            console.error(error);
            return '';
        }
    };

    // Load and filter products
    const allContent = await Promise.all(urls.map(fetchPageContent));
    const parser = new DOMParser();
    const filteredProducts = [];

    allContent.forEach(content => {
        const doc = parser.parseFromString(content, 'text/html');
        const products = doc.querySelectorAll('.product');
        
        products.forEach(product => {
            const nameElement = product.querySelector('h3');
            const descriptionElement = product.querySelector('p:not(.price)');
            const imageElement = product.querySelector('img');
            const priceElement = product.querySelector('.price');
            const priceValue = product.getAttribute('data-price');

            if (nameElement && descriptionElement && imageElement && priceElement) {
                const name = nameElement.textContent.trim();
                const description = descriptionElement.textContent.trim();
                const image = imageElement.src;
                const price = priceElement.textContent;

                if (name.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
                    filteredProducts.push({ 
                        name, 
                        description, 
                        image, 
                        price,
                        priceValue
                    });
                }
            }
        });
    });

    // Display filtered products
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.setAttribute('data-price', product.priceValue);
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <p class="price">${product.price}</p>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="buttoncarrito">Agregar al carrito</button>
        `;
        searchResultsContainer.appendChild(productElement);
    });

    // Attach event listeners to the newly created buttons
    if (window.cartInstance) {
        window.cartInstance.attachCartButtonListeners(searchResultsContainer);
    } else {
        // If cart instance is not available yet, wait for it
        const checkCartInterval = setInterval(() => {
            if (window.cartInstance) {
                clearInterval(checkCartInterval);
                window.cartInstance.attachCartButtonListeners(searchResultsContainer);
            }
        }, 100);
    }
});