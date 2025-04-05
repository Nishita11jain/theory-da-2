// Import products data (assuming it's in a separate file)
import { products } from 'data.js';

// Import addToCart function (assuming it's in a separate file)
import { addToCart } from './utils.js';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const productCount = document.getElementById('product-count');
const noProducts = document.getElementById('no-products');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const sortBy = document.getElementById('sort-by');
const categoryFilters = document.querySelectorAll('.category-filter');
const shapeFilters = document.querySelectorAll('.shape-filter');
const clearFilters = document.getElementById('clear-filters');

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
        document.querySelector(`.category-filter[value="${categoryParam}"]`).checked = true;
        document.querySelector(`.category-filter[value="all"]`).checked = false;
    }
    
    if (searchParam) {
        activeFilters.search = searchParam;
        document.getElementById('search-input').value = searchParam;
    }
    
    // Initialize price range
    priceRange.addEventListener('input', function() {
        const value = this.value;
        priceValue.textContent = `$${value}`;
        activeFilters.maxPrice = parseInt(value);
        applyFilters();
    });
    
    // Initialize sort
    sortBy.addEventListener('change', function() {
        applyFilters();
    });
    
    // Initialize category filters
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.value === 'all') {
                // If 'All' is checked, uncheck others
                if (this.checked) {
                    categoryFilters.forEach(f => {
                        if (f.value !== 'all') f.checked = false;
                    });
                    activeFilters.categories = ['all'];
                } else {
                    // If 'All' is unchecked, check it again (can't have none)
                    this.checked = true;
                }
            } else {
                // If a specific category is checked, uncheck 'All'
                document.querySelector('.category-filter[value="all"]').checked = false;
                
                // Update active filters
                activeFilters.categories = Array.from(categoryFilters)
                    .filter(f => f.checked && f.value !== 'all')
                    .map(f => f.value);
                
                // If no specific categories are checked, check 'All'
                if (activeFilters.categories.length === 0) {
                    document.querySelector('.category-filter[value="all"]').checked = true;
                    activeFilters.categories = ['all'];
                }
            }
            applyFilters();
        });
    });
    
    // Initialize shape filters
    shapeFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.value === 'all') {
                // If 'All' is checked, uncheck others
                if (this.checked) {
                    shapeFilters.forEach(f => {
                        if (f.value !== 'all') f.checked = false;
                    });
                    activeFilters.shapes = ['all'];
                } else {
                    // If 'All' is unchecked, check it again (can't have none)
                    this.checked = true;
                }
            } else {
                // If a specific shape is checked, uncheck 'All'
                document.querySelector('.shape-filter[value="all"]').checked = false;
                
                // Update active filters
                activeFilters.shapes = Array.from(shapeFilters)
                    .filter(f => f.checked && f.value !== 'all')
                    .map(f => f.value);
                
                // If no specific shapes are checked, check 'All'
                if (activeFilters.shapes.length === 0) {
                    document.querySelector('.shape-filter[value="all"]').checked = true;
                    activeFilters.shapes = ['all'];
                }
            }
            applyFilters();
        });
    });
    
    // Clear filters
    clearFilters.addEventListener('click', function() {
        // Reset category filters
        categoryFilters.forEach(f => {
            f.checked = f.value === 'all';
        });
        activeFilters.categories = ['all'];
        
        // Reset shape filters
        shapeFilters.forEach(f => {
            f.checked = f.value === 'all';
        });
        activeFilters.shapes = ['all'];
        
        // Reset price range
        priceRange.value = 300;
        priceValue.textContent = '$300';
        activeFilters.maxPrice = 300;
        
        // Reset search
        activeFilters.search = '';
        document.getElementById('search-input').value = '';
        
        // Reset sort
        sortBy.value = 'featured';
        
        applyFilters();
    });
    
    // Initial load
    applyFilters();
});

// Apply filters and sort
function applyFilters() {
    // Filter products
    filteredProducts = products.filter(product => {
        // Filter by category
        const categoryMatch = activeFilters.categories.includes('all') || 
                             activeFilters.categories.includes(product.category);
        
        // Filter by shape
        const shapeMatch = activeFilters.shapes.includes('all') || 
                          activeFilters.shapes.includes(product.shape);
        
        // Filter by price
        const priceMatch = product.price <= activeFilters.maxPrice;
        
        // Filter by search
        const searchMatch = !activeFilters.search || 
                           product.name.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                           product.category.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
                           product.description.toLowerCase().includes(activeFilters.search.toLowerCase());
        
        return categoryMatch && shapeMatch && priceMatch && searchMatch;
    });
    
    // Sort products
    const sortValue = sortBy.value;
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // featured
            filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    // Update product count
    productCount.textContent = filteredProducts.length;
    
    // Render products
    renderProducts();
}

// Render products
function renderProducts() {
    // Clear products grid
    productsGrid.innerHTML = '';
    
    // Show/hide no products message
    if (filteredProducts.length === 0) {
        noProducts.style.display = 'block';
    } else {
        noProducts.style.display = 'none';
        
        // Render each product
        filteredProducts.forEach(product => {
            const productElement = createProductElement(product);
            productsGrid.appendChild(productElement);
        });
    }
}

// Create product element (reusing function from main.js)
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    
    productElement.innerHTML = `
        <div class="product-image">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="product-overlay">
                <a href="product-details.html?id=${product.id}" title="View Details"><i class="fas fa-eye"></i></a>
                <a href="#" class="add-to-cart" data-id="${product.id}" title="Add to Cart"><i class="fas fa-shopping-cart"></i></a>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
        </div>
    `;
    
    // Add event listener to add to cart button
    const addToCartBtn = productElement.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addToCart(product.id);
    });
    
    return productElement;
}p