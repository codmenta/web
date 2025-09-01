document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA EL MENÚ HAMBURGUESA ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- 2. LÓGICA PARA LAS ANIMACIONES AL HACER SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // --- 3. LÓGICA DE FILTRADO PARA LA PÁGINA DE MENÚ ---
    const categoryLinks = document.querySelectorAll('.sidebar-widget a[data-category]');
    const stockCheckboxes = document.querySelectorAll('.sidebar-widget input[type="checkbox"]');
    const sortSelect = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
    const productCountEl = document.querySelector('.toolbar p');

    // Solo ejecuta el código de filtrado si estamos en la página de menú
    if (productGrid) {
        const productCards = Array.from(document.querySelectorAll('.product-card'));

        let currentFilters = {
            category: 'all',
            inStock: true,
            outOfStock: true
        };

        function applyFiltersAndSort() {
            // Filtrado
            const filteredCards = productCards.filter(card => {
                const cardCategory = card.dataset.category;
                const cardStock = card.dataset.stock;

                const categoryMatch = currentFilters.category === 'all' || currentFilters.category === cardCategory;
                const stockMatch = (currentFilters.inStock && cardStock === 'in-stock') || (currentFilters.outOfStock && cardStock === 'out-of-stock');

                return categoryMatch && stockMatch;
            });

            // Ordenamiento
            const sortBy = sortSelect.value;
            filteredCards.sort((a, b) => {
                const nameA = a.dataset.name.toLowerCase();
                const nameB = b.dataset.name.toLowerCase();
                const priceA = parseFloat(a.dataset.price);
                const priceB = parseFloat(b.dataset.price);

                if (sortBy === 'price-low') {
                    return priceA - priceB;
                } else if (sortBy === 'price-high') {
                    return priceB - priceA;
                } else { // alphabetical
                    return nameA.localeCompare(nameB);
                }
            });

            // Actualizar DOM
            productGrid.innerHTML = ''; // Limpiar el grid
            filteredCards.forEach(card => productGrid.appendChild(card)); // Añadir las tarjetas filtradas y ordenadas
            productCountEl.textContent = `${filteredCards.length} PRODUCTS`;
        }

        // Event Listeners para los filtros
        categoryLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                currentFilters.category = link.dataset.category;
                applyFiltersAndSort();
            });
        });

        stockCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                currentFilters.inStock = document.getElementById('in-stock').checked;
                currentFilters.outOfStock = document.getElementById('out-of-stock').checked;
                applyFiltersAndSort();
            });
        });

        sortSelect.addEventListener('change', applyFiltersAndSort);

        // Llamada inicial para mostrar productos
        applyFiltersAndSort();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // Cargar el footer
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });

    // Cargar el carrito
    fetch("cart.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("cart-placeholder").innerHTML = data;
        });
});

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA PARA EL MENÚ HAMBURGUESA ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- 2. LÓGICA PARA LAS ANIMACIONES AL HACER SCROLL ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // --- 3. LÓGICA DE FILTRADO PARA LA PÁGINA DE MENÚ (Ya existe) ---
    // (Tu código de filtrado de la página de menú permanece aquí)
    const categoryLinks = document.querySelectorAll('.sidebar-widget a[data-category]');
    const stockCheckboxes = document.querySelectorAll('.sidebar-widget input[type="checkbox"]');
    const sortSelect = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
    const productCountEl = document.querySelector('.toolbar p');
    if (productGrid) {
        // (El resto de tu código de filtrado va aquí sin cambios)
    }

    // --- 4. LÓGICA PARA EL CARRITO DE COMPRAS ---
    const cartIcons = document.querySelectorAll('.fa-shopping-cart');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');

    if (cartSidebar) {
        cartIcons.forEach(icon => {
            icon.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                cartSidebar.classList.add('active');
            });
        });

        cartClose.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }

    // --- 5. LÓGICA PARA EL BUSCADOR ---
    const searchIcons = document.querySelectorAll('.fa-search');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-overlay-close');

    if (searchOverlay) {
        searchIcons.forEach(icon => {
            // Evitamos que el icono del formulario de búsqueda abra el overlay de nuevo
            if (!icon.parentElement.classList.contains('search-button')) {
                icon.parentElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    searchOverlay.classList.add('active');
                });
            }
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });
    }

});