// Import products data (assuming it's in a separate file)
import products from './products.js';

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
    // Initialize cart count
    updateCartCount();
    
    // Load featured products on homepage
    if (document.getElementById('featured-products')) {
        loadFeaturedProducts();
    }
    
    // Search functionality
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
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Continue shopping button
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
});

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    const featuredProducts = products.filter(product => product.featured);
    
    featuredProducts.forEach(product => {
        const productElement = createProductElement(product);
        featuredProductsContainer.appendChild(productElement);
    });
}

// Create product element
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
}

// Cart functionality
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <div class="cart-message-content">
            <i class="fas fa-check-circle"></i>
            <p>${product.name} has been added to your cart!</p>
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Add cart message styles
const style = document.createElement('style');
style.textContent = `
    .cart-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4a90e2;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    }
    
    .cart-message.show {
        transform: translateX(0);
    }
    
    .cart-message-content {
        display: flex;
        align-items: center;
    }
    
    .cart-message-content i {
        margin-right: 10px;
        font-size: 1.2rem;
    }
    
    nav.active {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background-color: white;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
    }
    
    nav.active ul {
        flex-direction: column;
        padding: 20px;
    }
    
    nav.active ul li {
        margin: 10px 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);