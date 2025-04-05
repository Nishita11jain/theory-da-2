// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartShipping = document.getElementById('cart-shipping');
const cartTax = document.getElementById('cart-tax');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Helper functions for cart management (using localStorage for simplicity)
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load cart
    loadCart();
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        alert('Checkout functionality would be implemented here.');
    });
});

// Load cart
function loadCart() {
    const cart = getCart();
    
    if (cart.length === 0) {
        // Show empty cart message
        cartEmpty.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        cartSummary.style.display = 'none';
    } else {
        // Hide empty cart message
        cartEmpty.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartSummary.style.display = 'block';
        
        // Clear cart items
        cartItemsContainer.innerHTML = '';
        
        // Render cart items
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Update cart summary
        updateCartSummary();
    }
}

// Create cart item element
function createCartItemElement(item) {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    
    // Build options string
    let optionsText = `Color: ${item.color}`;
    if (item.lensType) optionsText += `, Lens: ${item.lensType}`;
    if (item.strength) optionsText += `, Strength: +${item.strength}`;
    
    cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>${optionsText}</p>
        </div>
        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="cart-item-quantity">
            <button class="cart-quantity-btn decrease" data-key="${item.optionKey}">-</button>
            <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="10" data-key="${item.optionKey}">
            <button class="cart-quantity-btn increase" data-key="${item.optionKey}">+</button>
        </div>
        <div class="cart-item-remove" data-key="${item.optionKey}">
            <i class="fas fa-trash"></i>
        </div>
    `;
    
    // Add event listeners
    
    // Decrease quantity
    const decreaseBtn = cartItemElement.querySelector('.decrease');
    decreaseBtn.addEventListener('click', function() {
        const key = this.getAttribute('data-key');
        updateCartItemQuantity(key, -1);
    });
    
    // Increase quantity
    const increaseBtn = cartItemElement.querySelector('.increase');
    increaseBtn.addEventListener('click', function() {
        const key = this.getAttribute('data-key');
        updateCartItemQuantity(key, 1);
    });
    
    // Quantity input
    const quantityInput = cartItemElement.querySelector('.cart-quantity-input');
    quantityInput.addEventListener('change', function() {
        const key = this.getAttribute('data-key');
        const newQuantity = parseInt(this.value);
        
        if (newQuantity >= 1 && newQuantity <= 10) {
            setCartItemQuantity(key, newQuantity);
        } else {
            // Reset to valid value
            const cart = getCart();
            const item = cart.find(item => item.optionKey === key);
            this.value = item ? item.quantity : 1;
        }
    });
    
    // Remove item
    const removeBtn = cartItemElement.querySelector('.cart-item-remove');
    removeBtn.addEventListener('click', function() {
        const key = this.getAttribute('data-key');
        removeCartItem(key);
    });
    
    return cartItemElement;
}

// Update cart item quantity
function updateCartItemQuantity(key, change) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.optionKey === key);
    
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        
        if (newQuantity >= 1 && newQuantity <= 10) {
            cart[itemIndex].quantity = newQuantity;
            saveCart(cart);
            loadCart();
        }
    }
}

// Set cart item quantity
function setCartItemQuantity(key, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.optionKey === key);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        saveCart(cart);
        loadCart();
    }
}

// Remove cart item
function removeCartItem(key) {
    const cart = getCart();
    const newCart = cart.filter(item => item.optionKey !== key);
    
    saveCart(newCart);
    loadCart();
}

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free over $100, otherwise $10)
    const shipping = subtotal >= 100 ? 0 : 10;
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update summary
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}c