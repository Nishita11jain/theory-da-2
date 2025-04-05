// Import products data (assuming it's in a separate file)
import { products } from './data.js';
import { createProductElement } from './products.js';
import { getCart, saveCart } from './cart.js';

// DOM Elements
const productContainer = document.getElementById('product-container');
const productTitle = document.getElementById('product-title');
const breadcrumbProduct = document.getElementById('breadcrumb-product');
const relatedProductsContainer = document.getElementById('related-products');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        // Find product
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Update page title and breadcrumb
            productTitle.textContent = product.name;
            breadcrumbProduct.textContent = product.name;
            document.title = `${product.name} - VisionCraft`;
            
            // Render product details
            renderProductDetails(product);
            
            // Render related products
            renderRelatedProducts(product);
        } else {
            // Product not found
            productContainer.innerHTML = `
                <div class="product-not-found">
                    <h2>Product Not Found</h2>
                    <p>The product you are looking for does not exist.</p>
                    <a href="products.html" class="btn">Browse Products</a>
                </div>
            `;
        }
    }
});

// Render product details
function renderProductDetails(product) {
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
                    <label>Color</label>
                    <div class="color-options">
                        ${product.colors.map((color, index) => `
                            <div class="color-option ${index === 0 ? 'active' : ''}" 
                                 style="background-color: ${getColorCode(color)}" 
                                 data-color="${color}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                ${product.category === 'prescription' || product.category === 'reading' ? `
                    <div class="option-group">
                        <label>Lens Type</label>
                        <select id="lens-type">
                            <option value="single">Single Vision</option>
                            <option value="bifocal">Bifocal</option>
                            <option value="progressive">Progressive</option>
                        </select>
                    </div>
                ` : ''}
                ${product.category === 'reading' ? `
                    <div class="option-group">
                        <label>Strength</label>
                        <select id="strength">
                            <option value="1.0">+1.00</option>
                            <option value="1.5">+1.50</option>
                            <option value="2.0">+2.00</option>
                            <option value="2.5">+2.50</option>
                            <option value="3.0">+3.00</option>
                        </select>
                    </div>
                ` : ''}
            </div>
            <div class="quantity-selector">
                <button class="quantity-btn" id="decrease-quantity">-</button>
                <input type="number" id="quantity" class="quantity-input" value="1" min="1" max="10">
                <button class="quantity-btn" id="increase-quantity">+</button>
            </div>
            <div class="product-actions">
                <button class="btn add-to-cart-btn" id="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                <button class="wishlist-btn" id="wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
        </div>
    `;
    
    // Add event listeners
    
    // Thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.getAttribute('data-image');
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update active color
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        const colorOption = document.querySelector('.color-option.active');
        const color = colorOption ? colorOption.getAttribute('data-color') : product.colors[0];
        
        let lensType = '';
        let strength = '';
        
        if (product.category === 'prescription' || product.category === 'reading') {
            const lensTypeSelect = document.getElementById('lens-type');
            lensType = lensTypeSelect ? lensTypeSelect.value : 'single';
        }
        
        if (product.category === 'reading') {
            const strengthSelect = document.getElementById('strength');
            strength = strengthSelect ? strengthSelect.value : '1.0';
        }
        
        // Add to cart with options
        addToCartWithOptions(product.id, quantity, color, lensType, strength);
    });
    
    // Wishlist button
    const wishlistBtn = document.getElementById('wishlist-btn');
    
    wishlistBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            // Add to wishlist functionality would go here
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            // Remove from wishlist functionality would go here
        }
    });
}

// Render related products
function renderRelatedProducts(currentProduct) {
    // Get products in the same category
    let related = products.filter(p => 
        p.category === currentProduct.category && 
        p.id !== currentProduct.id
    );
    
    // If not enough products in the same category, add some from other categories
    if (related.length < 4) {
        const additional = products.filter(p => 
            p.category !== currentProduct.category && 
            p.id !== currentProduct.id
        ).slice(0, 4 - related.length);
        
        related = [...related, ...additional];
    }
    
    // Limit to 4 products
    related = related.slice(0, 4);
    
    // Render products
    related.forEach(product => {
        const productElement = createProductElement(product);
        relatedProductsContainer.appendChild(productElement);
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Get color code from color name
function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Tortoise': '#704214',
        'Crystal': '#F5F5F5',
        'Navy': '#000080',
        'Burgundy': '#800020',
        'Gold': '#FFD700',
        'Silver': '#C0C0C0',
        'Red': '#FF0000',
        'Brown': '#A52A2A',
        'Blue': '#0000FF',
        'Gray': '#808080',
        'Gunmetal': '#2C3539',
        'Gold/Green': '#FFD700',
        'Silver/Blue': '#C0C0C0',
        'Black/Gray': '#000000'
    };
    
    return colorMap[colorName] || '#000000';
}

// Add to cart with options
function addToCartWithOptions(productId, quantity, color, lensType, strength) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const cart = getCart();
    
    // Create a unique key for this product + options combination
    const optionKey = `${productId}-${color}-${lensType}-${strength}`;
    const existingItemIndex = cart.findIndex(item => item.optionKey === optionKey);
    
    if (existingItemIndex !== -1) {
        // Update existing item
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            color: color,
            lensType: lensType,
            strength: strength,
            optionKey: optionKey
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