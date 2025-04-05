// Import products data
import { products } from './data.js';
// Import cart functions
import { getCart, saveCart } from './cart.js';
const USD_TO_INR = 83.00;

// DOM Elements
const searchIcon = document.getElementById('search-icon');
const closeSearch = document.getElementById('close-search');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.getElementById('search-input');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const cartCountElement = document.getElementById('cart-count');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count on page load
    updateCartCount();

    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }

    // Search functionality
    if (searchIcon && searchContainer && closeSearch && searchInput) {
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchContainer.classList.add('active');
            searchInput.focus();
        });

        closeSearch.addEventListener('click', function() {
            searchContainer.classList.remove('active');
        });

        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }

    // Mobile menu toggle
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Continue shopping button (global handler)
    // Use event delegation on the body in case the button is added dynamically
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.continue-btn')) {
            window.location.href = 'products.html';
        }
    });
});

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;

    const featured = products.filter(product => product.featured); // Use imported products array
    featuredProductsContainer.innerHTML = ''; // Clear existing

    featured.forEach(product => {
        const productElement = createProductElement(product); // Use createProductElement from this file
        featuredProductsContainer.appendChild(productElement);
    });
}

// Create product element (basic version for homepage/general grids)
function createProductElement(product) {
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
            <p class="product-price">₹${(product.price * USD_TO_INR).toFixed(2)}</p>
        </div>
    `;

    // Add event listener for the add-to-cart button
    const addToCartBtn = productElement.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigation
            const productId = parseInt(e.target.closest('.add-to-cart-btn').getAttribute('data-id'));
            addToCart(productId); // Call the global addToCart
            showNotification(`${product.name} added to cart!`);
        });
    }

    return productElement;
}

// --- Global Cart Functions ---

// Add item to cart (basic version for products without options)
export function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    let cart = getCart(); // Use imported getCart

    // Check if item already exists (simple version, no options)
    const existingItemIndex = cart.findIndex(item => item.id === productId);

    if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item (default color/options for simplicity)
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color: product.colors[0], // Default color
            quantity: quantity
        });
    }

    saveCart(cart); // Use imported saveCart
    updateCartCount(); // Update header count
}

// Update cart count display in header
export function updateCartCount() {
    const cart = getCart(); // Use imported getCart
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Function to show a notification message
export function showNotification(message) {
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        notification.className = 'cart-notification'; // Add class for styling
        document.body.appendChild(notification);
    }
    notification.textContent = message;
    notification.classList.add('show'); // Add class to show

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}