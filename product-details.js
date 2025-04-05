// Import products data
import { products } from './data.js';
// Import cart functions
import { getCart, saveCart } from './cart.js';
// Import global functions from main.js
import { updateCartCount } from './main.js';
// DOM Elements
const productContainer = document.getElementById('product-container');
const productTitleElement = document.getElementById('product-title'); // Renamed to avoid conflict
const breadcrumbProduct = document.getElementById('breadcrumb-product');
const relatedProductsContainer = document.getElementById('related-products');

// State for selected options
let currentProduct = null;
let selectedOptions = {
    color: null,
    lensType: null, // Add other options as needed
    strength: null
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (isNaN(productId)) {
        displayProductNotFound();
        return;
    }

    // Find product
    currentProduct = products.find(p => p.id === productId);

    if (currentProduct) {
        // Update page metadata
        if (productTitleElement) productTitleElement.textContent = currentProduct.name;
        if (breadcrumbProduct) breadcrumbProduct.textContent = currentProduct.name;
        document.title = `${currentProduct.name} - VisionCraft`;

        // Render product details and related products
        renderProductDetails(currentProduct);
        renderRelatedProducts(currentProduct);
        setupOptionListeners(); // Setup listeners after rendering details
        updateCartCount(); // Ensure header count is correct on load
    } else {
        displayProductNotFound();
    }
});

function displayProductNotFound() {
     if (productContainer) {
          productContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you are looking for does not exist.</p>
                <a href="products.html" class="btn">Browse All Products</a>
            </div>
        `;
     }
     if (relatedProductsContainer) relatedProductsContainer.style.display = 'none'; // Hide related section
     if (productTitleElement) productTitleElement.textContent = "Product Not Found";
     if (breadcrumbProduct) breadcrumbProduct.textContent = "Not Found";
}


// Render product details
function renderProductDetails(product) {
    if (!productContainer) return;

    // Set default options
    selectedOptions.color = product.colors[0];
    selectedOptions.lensType = (product.category === 'prescription' || product.category === 'reading') ? 'single-vision' : null;
    selectedOptions.strength = (product.category === 'reading') ? '+1.00' : null;


    productContainer.innerHTML = `
        <div class="product-gallery">
            <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="main-image">
            <div class="thumbnail-images">
                ${product.images.map((image, index) => `
                    <img src="${image}" alt="${product.name} ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                `).join('')}
            </div>
        </div>
        <div class="product-info-details">
            <h1>${product.name}</h1>
            <div class="product-meta">
                <span>Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                <span>Shape: ${product.shape.charAt(0).toUpperCase() + product.shape.slice(1)}</span>
            </div>
            <div class="product-rating">
                ${generateStarRating(product.rating)}
                <span>${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
            </div>
            <div class="product-price-details">$${product.price.toFixed(2)}</div>
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <div class="product-features">
                <h3>Features</h3>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="product-options">
                <div class="option-group">
                    <label>Color:</label>
                    <div class="color-options">
                        ${product.colors.map((color, index) => `
                            <div class="color-option ${index === 0 ? 'active' : ''}"
                                 style="background-color: ${getColorCode(color)}"
                                 data-color="${color}" title="${color}">
                                 ${index === 0 ? '<i class="fas fa-check"></i>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                 ${(product.category === 'prescription' || product.category === 'reading') ? `
                    <div class="option-group">
                        <label for="lens-type">Lens Type:</label>
                        <select id="lens-type">
                            <option value="single-vision">Single Vision</option>
                            <option value="progressive">Progressive</option>
                            <option value="bifocal">Bifocal</option>
                        </select>
                    </div>
                ` : ''}

                 ${product.category === 'reading' ? `
                     <div class="option-group">
                        <label for="strength-select">Strength:</label>
                        <select id="strength-select">
                            <option value="+1.00">+1.00</option>
                            <option value="+1.25">+1.25</option>
                            <option value="+1.50">+1.50</option>
                            <option value="+1.75">+1.75</option>
                            <option value="+2.00">+2.00</option>
                             <option value="+2.25">+2.25</option>
                             <option value="+2.50">+2.50</option>
                             <option value="+2.75">+2.75</option>
                             <option value="+3.00">+3.00</option>
                        </select>
                    </div>
                ` : ''}

            </div>

            <div class="product-actions">
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" value="1" min="1" max="10">
                </div>
                <button id="add-to-cart-details" class="btn">Add to Cart</button>
            </div>
             <div id="cart-feedback" class="cart-feedback-message"></div>
        </div>
    `;
}

// Setup listeners for options and buttons after rendering
function setupOptionListeners() {
    // Thumbnail image clicks
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            if (mainImage) mainImage.src = this.getAttribute('data-image');
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Color option clicks
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectedOptions.color = this.getAttribute('data-color');
            colorOptions.forEach(opt => {
                opt.classList.remove('active');
                opt.innerHTML = ''; // Remove checkmark
            });
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-check"></i>'; // Add checkmark
        });
    });

     // Lens type change
    const lensTypeSelect = document.getElementById('lens-type');
    if (lensTypeSelect) {
        lensTypeSelect.addEventListener('change', function() {
            selectedOptions.lensType = this.value;
        });
    }

     // Strength change
    const strengthSelect = document.getElementById('strength-select');
    if (strengthSelect) {
        strengthSelect.addEventListener('change', function() {
             selectedOptions.strength = this.value;
        });
    }

    // Add to Cart button click
    const addToCartBtn = document.getElementById('add-to-cart-details');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCartWithOptions);
    }
}


// Handle Add to Cart from details page
function handleAddToCartWithOptions() {
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    if (currentProduct) {
        addToCartWithOptions(currentProduct.id, quantity, selectedOptions);
        // Provide user feedback
        const feedbackDiv = document.getElementById('cart-feedback');
        if(feedbackDiv) {
            feedbackDiv.textContent = `${currentProduct.name} added to cart!`;
            feedbackDiv.style.display = 'block';
            setTimeout(() => { feedbackDiv.style.display = 'none'; }, 3000);
        }

    } else {
        console.error("Cannot add to cart: currentProduct is null.");
         const feedbackDiv = document.getElementById('cart-feedback');
         if(feedbackDiv) {
            feedbackDiv.textContent = `Error adding item to cart.`;
             feedbackDiv.style.color = 'red';
            feedbackDiv.style.display = 'block';
            setTimeout(() => { feedbackDiv.style.display = 'none'; feedbackDiv.style.color = ''; }, 3000);
        }
    }
}


// Add item with specific options to cart
function addToCartWithOptions(productId, quantity, options) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = getCart();

    // Create a unique key based on product ID and selected options
    const optionKey = `${productId}-${options.color || ''}-${options.lensType || ''}-${options.strength || ''}`;

    const existingItemIndex = cart.findIndex(item => item.optionKey === optionKey);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            optionKey: optionKey, // Store the unique key
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            color: options.color,
            lensType: options.lensType,
            strength: options.strength
            // Add other selected options here
        });
    }

    saveCart(cart);
    updateCartCount(); // Update header icon
}


// Render related products
function renderRelatedProducts(currentProduct) {
     if (!relatedProductsContainer) return;

    // Simple logic: find products in the same category, excluding the current one
    const related = products.filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
                           .slice(0, 4); // Limit to 4 related products

    relatedProductsContainer.innerHTML = ''; // Clear previous
    if (related.length > 0) {
        related.forEach(product => {
             // Use the createProductElement function from main.js (assuming it's global/accessible)
             if (typeof createProductElement === 'function') {
                 const productElement = createProductElement(product);
                 relatedProductsContainer.appendChild(productElement);
             } else {
                 // Fallback or error if the function isn't available
                  console.warn("createProductElement function not found for related products.");
                  // You could render a simpler version here if needed
             }
        });
    } else {
        relatedProductsContainer.innerHTML = '<p>No related products found.</p>';
    }
}


// Helper function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>'; // Use 'far' for empty stars

    return starsHTML;
}

// Helper function to get CSS color code (customize as needed)
function getColorCode(colorName) {
    const colors = {
        "Black": "#000000",
        "Tortoise": "#654321", // Example
        "Crystal": "#f0f8ff", // Example (AliceBlue)
        "Navy": "#000080",
        "Burgundy": "#800020",
        "Gold/Green": "gold", // Simplification
        "Silver/Blue": "silver", // Simplification
        "Black/Gray": "black", // Simplification
        "Pink": "#FFC0CB",
        "Clear": "transparent", // May need border
        "Matte Black": "#333333", // Example
        "Brown": "#A52A2A",
        "Blue": "#0000FF",
        "Gray": "#808080",
         "Black/Red": "black" // Simplification
    };
    // Add border for very light/transparent colors
    if (colorName === 'Crystal' || colorName === 'Clear') {
         return `${colors[colorName] || '#cccccc'}; border: 1px solid #ccc;`;
    }
    return colors[colorName] || '#cccccc'; // Default gray
}
