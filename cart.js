// Import needed functions from main.js (assuming updateCartCount is exported there)
import { updateCartCount } from './main.js';
export function getCart() {
    try {
        // Ensure localStorage is available and accessible
        if (typeof localStorage !== 'undefined') {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } else {
            console.warn("localStorage is not available.");
            return [];
        }
    } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return [];
    }
}

export function saveCart(cart) {
    try {
        // Ensure localStorage is available and accessible
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            console.warn("localStorage is not available. Cart not saved.");
        }
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

// Constants for calculations (can be defined globally within the module)
const TAX_RATE = 0.08; // 8% Tax Rate Example
const SHIPPING_THRESHOLD = 100; // Free shipping over $100
const SHIPPING_COST = 10.00; // Standard shipping cost

// --- Event Listener for DOM Ready ---
document.addEventListener('DOMContentLoaded', function() {
    // Always try to update the header cart count on any page load
    // Ensure updateCartCount is robust and handles cases where the element might not exist yet
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not imported or available.");
    }

    // --- Cart Page Specific Logic ---
    // Check if the essential cart page elements exist before trying to use them
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    // Add checks for summary calculation elements too
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const cartShippingElem = document.getElementById('cart-shipping');
    const cartTaxElem = document.getElementById('cart-tax');
    const cartTotalElem = document.getElementById('cart-total');

    const USD_TO_INR = 83.00;


    // Only proceed with cart page setup if *all* critical elements are found
    if (cartItemsContainer && cartEmpty && cartSummary && checkoutBtn &&
        cartSubtotalElem && cartShippingElem && cartTaxElem && cartTotalElem) {

        console.log("Initializing cart page elements and listeners."); // For debugging

        // Load the cart items into the display
        loadCartDisplay(cartItemsContainer, cartEmpty, cartSummary, USD_TO_INR); // Pass USD_TO_INR

        // Add event listener for the checkout button
        checkoutBtn.addEventListener('click', function() {
            alert('Proceeding to Checkout (Not Implemented)');
        });

        // Add event listeners for cart actions using event delegation
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            const cartItemElement = target.closest('.cart-item');
            if (!cartItemElement) return;

            const itemKey = cartItemElement.getAttribute('data-key');
            if (!itemKey) return;

            if (target.classList.contains('decrease')) {
                updateCartItemQuantity(itemKey, -1, USD_TO_INR); // Pass USD_TO_INR
            } else if (target.classList.contains('increase')) {
                updateCartItemQuantity(itemKey, 1, USD_TO_INR); // Pass USD_TO_INR
            } else if (target.closest('.cart-item-remove')) {
                removeCartItem(itemKey, USD_TO_INR); // Pass USD_TO_INR
            }
        });

        cartItemsContainer.addEventListener('change', function(e) {
            const target = e.target;
            if (target.classList.contains('cart-quantity-input')) {
                const cartItemElement = target.closest('.cart-item');
                if (!cartItemElement) return;

                const itemKey = cartItemElement.getAttribute('data-key');
                if (!itemKey) return;

                let newQuantity = parseInt(target.value);

                // Basic validation
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                } else if (newQuantity > 10) { // Example max quantity
                    newQuantity = 10;
                }
                target.value = newQuantity; // Ensure input reflects validated value
                setCartItemQuantity(itemKey, newQuantity, USD_TO_INR); // Pass USD_TO_INR
            }
        });

    } else {
        // Optional: Log that we're not on the cart page
        // console.log("Not on the cart page or essential elements missing. Skipping cart display setup.");
    }

}); // End of DOMContentLoaded

// --- Cart Display Functions (Only relevant on cart page) ---

// Load/reload the cart items displayed on the cart page
function loadCartDisplay(container, emptyMsg, summaryBox, exchangeRate) {
    const cart = getCart();
    container.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        container.style.display = 'none';
        summaryBox.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        container.style.display = 'block'; // Or 'grid'/'flex'
        summaryBox.style.display = 'block'; // Or 'grid'/'flex'

        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item, exchangeRate); // Pass exchangeRate
            if (cartItemElement) {
                container.appendChild(cartItemElement);
            }
        });
        updateCartSummaryDisplay(exchangeRate); // Pass exchangeRate
    }
    // No need to call updateCartCount here, as DOMContentLoaded already did,
    // and modification functions will call it.
}

// Create HTML element for a single cart item
function createCartItemElement(item, exchangeRate) {
    // Use optionKey if available, otherwise fallback to id (for items added without options)
    const itemKey = item.optionKey || item.id?.toString();
    if (!itemKey) {
        console.error("Cart item missing key:", item);
        return null; // Cannot create element without a key
    }

    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.setAttribute('data-key', itemKey);

    // Build options string defensively
    let optionsText = `Color: ${item.color || 'N/A'}`;
    if (item.lensType) optionsText += `, Lens: ${item.lensType}`;
    if (item.strength) optionsText += `, Strength: ${item.strength}`; // Removed extra '+'

    const itemSubtotalUSD = (item.price && item.quantity) ? (item.price * item.quantity) : 0;
    const itemSubtotalINR = itemSubtotalUSD * exchangeRate;

    cartItemElement.innerHTML = `
        <img src="${item.image || 'placeholder.png'}" alt="${item.name || 'Product'}" class="cart-item-image">
        <div class="cart-item-details">
            <h3 class="cart-item-title">${item.name || 'Unknown Item'}</h3>
            <p class="cart-item-options">${optionsText}</p>
            <p class="cart-item-price">₹${item.price ? (item.price * exchangeRate).toFixed(2) : 'N/A'}</p>
        </div>
        <div class="cart-item-quantity">
            <button class="quantity-btn decrease" aria-label="Decrease quantity">-</button>
            <input type="number" class="cart-quantity-input" value="${item.quantity || 1}" min="1" max="10" aria-label="Quantity">
            <button class="quantity-btn increase" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-total">₹${itemSubtotalINR.toFixed(2)}</div>
        <button class="cart-item-remove" aria-label="Remove item">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    return cartItemElement;
}

// Update the cart summary display on the cart page
function updateCartSummaryDisplay(exchangeRate) {
    // Get summary elements (assuming this is only called if they exist)
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const cartShippingElem = document.getElementById('cart-shipping');
    const cartTaxElem = document.getElementById('cart-tax');
    const cartTotalElem = document.getElementById('cart-total');

    // Defensive check, although the caller should ensure these exist
    if (!cartSubtotalElem || !cartShippingElem || !cartTaxElem || !cartTotalElem) {
        console.error("updateCartSummaryDisplay: Could not find summary DOM elements.");
        return;
    }

    const cart = getCart();
    const subtotalUSD = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
    const subtotalINR = subtotalUSD * exchangeRate;
    const shippingUSD = subtotalUSD >= SHIPPING_THRESHOLD || subtotalUSD === 0 ? 0 : SHIPPING_COST;
    const shippingINR = shippingUSD * exchangeRate;
    const taxINR = subtotalINR * TAX_RATE;
    const totalINR = subtotalINR + shippingINR + taxINR;

    cartSubtotalElem.textContent = `₹${subtotalINR.toFixed(2)}`;
    cartShippingElem.textContent = shippingUSD === 0 ? (subtotalUSD > 0 ? 'Free' : '₹0.00') : `₹${shippingINR.toFixed(2)}`;
    cartTaxElem.textContent = `₹${taxINR.toFixed(2)}`;
    cartTotalElem.textContent = `₹${totalINR.toFixed(2)}`;
}


// --- Cart Data Modification Functions (Can be called from any page) ---

// Update quantity by increment (delta = 1 or -1)
function updateCartItemQuantity(itemKey, delta, exchangeRate) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => (item.optionKey || item.id?.toString()) === itemKey);

    if (itemIndex > -1) {
        const newQuantity = (cart[itemIndex].quantity || 0) + delta;
        if (newQuantity >= 1 && newQuantity <= 10) { // Enforce min/max
            cart[itemIndex].quantity = newQuantity;
            saveCart(cart);
            updateCartCount(); // Update header immediately
            // Reload display *only if* we are on the cart page
            const container = document.getElementById('cart-items');
            if (container) {
                loadCartDisplay(container, document.getElementById('cart-empty'), document.getElementById('cart-summary'), exchangeRate); // Pass exchangeRate
            }
        } else if (newQuantity < 1) {
             // Optionally remove if quantity goes below 1
             removeCartItem(itemKey, exchangeRate); // Pass exchangeRate
        }
    }
}

// Set specific quantity from input
function setCartItemQuantity(itemKey, newQuantity, exchangeRate) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => (item.optionKey || item.id?.toString()) === itemKey);

    if (itemIndex > -1) {
        // Ensure quantity is within valid range
        const validatedQuantity = Math.max(1, Math.min(10, newQuantity)); // Clamp between 1 and 10
        cart[itemIndex].quantity = validatedQuantity;
        saveCart(cart);
        updateCartCount(); // Update header immediately
        // Reload display *only if* we are on the cart page
        const container = document.getElementById('cart-items');
        if (container) {
            loadCartDisplay(container, document.getElementById('cart-empty'), document.getElementById('cart-summary'), exchangeRate); // Pass exchangeRate
        }
    }
}


// Remove item from cart
function removeCartItem(itemKey, exchangeRate) {
    let cart = getCart();
    const updatedCart = cart.filter(item => (item.optionKey || item.id?.toString()) !== itemKey);
    if (cart.length !== updatedCart.length) { // Check if something was actually removed
        saveCart(updatedCart);
        updateCartCount(); // Update header immediately
        // Reload display *only if* we are on the cart page
        const container = document.getElementById('cart-items');
        if (container) {
            loadCartDisplay(container, document.getElementById('cart-empty'), document.getElementById('cart-summary'), exchangeRate); // Pass exchangeRate
        }
    }
}