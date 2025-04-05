// Import products data
import { products } from './data.js';
// Import main functions (specifically for global addToCart if needed, though createProductElement is local now)
import { updateCartCount, addToCart, showNotification } from './main.js'; // Needed if actions here modify cart count directly
// DOM Elements
const productsGrid = document.getElementById('products-grid');
const productCount = document.getElementById('product-count');
const noProducts = document.getElementById('no-products');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const sortBy = document.getElementById('sort-by');
const categoryFilters = document.querySelectorAll('.category-filter');
const shapeFilters = document.querySelectorAll('.shape-filter');
const clearFiltersBtn = document.getElementById('clear-filters'); // Corrected ID reference
const searchInput = document.getElementById('search-input'); // Assuming header search input is relevant

// State
let filteredProducts = [...products];
let activeFilters = {
    categories: ['all'],
    shapes: ['all'],
    maxPrice: 300,
    search: ''
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    // Apply URL parameters to filters
    if (categoryParam) {
        activeFilters.categories = [categoryParam];
        // Update checkboxes visually
        categoryFilters.forEach(f => {
            f.checked = activeFilters.categories.includes(f.value);
        });
        if (activeFilters.categories.length > 0 && !activeFilters.categories.includes('all')) {
            const allCat = document.querySelector('.category-filter[value="all"]');
            if(allCat) allCat.checked = false;
        }
    }

    if (searchParam) {
        activeFilters.search = searchParam.toLowerCase();
        // Update search input field if it exists on this page's header context
        const headerSearchInput = document.querySelector('header #search-input');
         if (headerSearchInput) headerSearchInput.value = searchParam;
    }

    // Initialize filters and render products
    initializeFilters();
    applyFilters(); // Initial render based on URL params or defaults
});

function initializeFilters() {
    // Price Range
    if (priceRange && priceValue) {
        // Set initial display value
        priceValue.textContent = `$${priceRange.value}`;
        activeFilters.maxPrice = parseInt(priceRange.value);

        priceRange.addEventListener('input', function() {
            const value = this.value;
            priceValue.textContent = `$${value}`;
            activeFilters.maxPrice = parseInt(value);
            applyFilters();
        });
    }

    // Sort By
    if (sortBy) {
        sortBy.addEventListener('change', applyFilters);
    }

    // Category Filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', handleCategoryFilterChange);
    });

    // Shape Filters
    shapeFilters.forEach(filter => {
        filter.addEventListener('change', handleShapeFilterChange);
    });

    // Clear Filters Button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function handleCategoryFilterChange() {
    const allCheckbox = document.querySelector('.category-filter[value="all"]');
    if (this.value === 'all') {
        if (this.checked) {
            categoryFilters.forEach(f => { if (f !== this) f.checked = false; });
            activeFilters.categories = ['all'];
        } else {
            // Prevent unchecking 'All' if it's the only one checked
            this.checked = true;
        }
    } else {
        if (this.checked) {
           if(allCheckbox) allCheckbox.checked = false;
            activeFilters.categories = Array.from(categoryFilters)
                .filter(f => f.checked && f.value !== 'all')
                .map(f => f.value);
        } else {
            activeFilters.categories = activeFilters.categories.filter(cat => cat !== this.value);
            // If no specific category is checked, check 'All'
            if (activeFilters.categories.length === 0 && allCheckbox) {
                allCheckbox.checked = true;
                activeFilters.categories = ['all'];
            }
        }
    }
    applyFilters();
}

function handleShapeFilterChange() {
    const allCheckbox = document.querySelector('.shape-filter[value="all"]');
    if (this.value === 'all') {
        if (this.checked) {
            shapeFilters.forEach(f => { if (f !== this) f.checked = false; });
            activeFilters.shapes = ['all'];
        } else {
            this.checked = true;
        }
    } else {
        if (this.checked) {
            if(allCheckbox) allCheckbox.checked = false;
            activeFilters.shapes = Array.from(shapeFilters)
                .filter(f => f.checked && f.value !== 'all')
                .map(f => f.value);
        } else {
            activeFilters.shapes = activeFilters.shapes.filter(shape => shape !== this.value);
            if (activeFilters.shapes.length === 0 && allCheckbox) {
                allCheckbox.checked = true;
                activeFilters.shapes = ['all'];
            }
        }
    }
    applyFilters();
}


// Apply all active filters and re-render products
function applyFilters() {
    filteredProducts = products.filter(product => {
        // Category filter
        const categoryMatch = activeFilters.categories.includes('all') || activeFilters.categories.includes(product.category);

        // Shape filter
        const shapeMatch = activeFilters.shapes.includes('all') || activeFilters.shapes.includes(product.shape);

        // Price filter
        const priceMatch = product.price <= activeFilters.maxPrice;

        // Search filter (checks name and description)
        const searchMatch = activeFilters.search === '' ||
                            product.name.toLowerCase().includes(activeFilters.search) ||
                            product.description.toLowerCase().includes(activeFilters.search);

        return categoryMatch && shapeMatch && priceMatch && searchMatch;
    });

    // Apply sorting
    sortProducts();

    // Render the filtered and sorted products
    renderProducts();
}

// Sort products based on selection
function sortProducts() {
    const sortValue = sortBy ? sortBy.value : 'default';
    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'default':
        default:
            // Optional: sort by ID or keep original order if needed
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
    }
}

// Render products grid
function renderProducts() {
    if (!productsGrid || !productCount || !noProducts) return;

    productsGrid.innerHTML = ''; // Clear grid

    if (filteredProducts.length === 0) {
        noProducts.style.display = 'block';
        productsGrid.style.display = 'none';
        productCount.textContent = 'Showing 0 products';
    } else {
        noProducts.style.display = 'none';
        productsGrid.style.display = 'grid'; // Or 'flex' etc.
        productCount.textContent = `Showing ${filteredProducts.length} products`;
        filteredProducts.forEach(product => {
            // Use the createProductElement function defined in main.js for consistency
            // We need to ensure main.js and its createProductElement is available globally or imported
            // For simplicity here, let's redefine a similar function locally in this module scope
            const productElement = createProductElementLocal(product);
            productsGrid.appendChild(productElement);
        });
    }
}

// Create product element (Local version for products page)
// Calls the global addToCart defined in main.js
function createProductElementLocal(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
        <div class="product-image">
            <a href="product-details.html?id=${product.id}">
                <img src="${product.images[0]}" alt="${product.name}">
            </a>
            <div class="product-overlay">
                    <a href="#" class="add-to-cart-btn" data-id="${product.id}" title="Add to Cart"><i class="fas fa-shopping-cart"></i></a>
                    <a href="product-details.html?id=${product.id}" title="View Details"><i class="fas fa-eye"></i></a>
            </div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
            <p class="product-price">₹${(product.price * 83.00).toFixed(2)}</p>
        </div>
    `;

    // Add event listener for the add-to-cart button
    const addToCartBtn = productElement.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(e.target.closest('.add-to-cart-btn').getAttribute('data-id'));
            // Assuming 'addToCart' is globally available from main.js
            if (typeof addToCart === 'function') {
                addToCart(productId); // Call the global addToCart
                showNotification(`${product.name} added to cart!`); // Use notification from main.js
            } else {
                console.error('addToCart function not found.');
            }
        });
    }
    return productElement;
}

// Clear all filters
function clearAllFilters() {
    // Reset checkboxes
    categoryFilters.forEach(f => f.checked = (f.value === 'all'));
    shapeFilters.forEach(f => f.checked = (f.value === 'all'));

    // Reset price range slider and display
    if(priceRange && priceValue) {
        priceRange.value = 300;
        priceValue.textContent = '$300';
    }

     // Reset sort dropdown
    if(sortBy) {
        sortBy.value = 'default';
    }

    // Reset active filters state
    activeFilters = {
        categories: ['all'],
        shapes: ['all'],
        maxPrice: 300,
        search: activeFilters.search // Keep search term if needed, or clear: ''
    };

    // Re-apply filters to render all products
    applyFilters();
}