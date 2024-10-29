let cart = [];

// Function to add items to the cart
function addToCart(item, price) {
    cart.push({ item, price });
    updateCart();
    toggleCart(true); // Show cart when an item is added
}

// Function to update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Clear existing items
    let totalPrice = 0;

    // Loop through cart items and display them
    cart.forEach(cartItem => {
        const li = document.createElement('li');
        li.textContent = `${cartItem.item} - $${cartItem.price}`;
        cartItems.appendChild(li);
        totalPrice += cartItem.price; // Calculate total price
    });

    document.getElementById('total-price').textContent = `Total: $${totalPrice}`; // Update total price
}

// Function to place the order
function placeOrder() {
    const paymentMethod = document.getElementById('payment-method').value;
    alert(`Your order has been placed! Payment Method: ${paymentMethod}`);
    cart = []; // Clear the cart
    updateCart(); // Update the cart display
    toggleCart(false); // Hide cart after placing the order
}

// Function to toggle cart visibility
function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    // Show or hide the cart dropdown
    if (cartDropdown.style.display === 'none' || cartDropdown.style.display === '') {
        cartDropdown.style.display = 'block'; // Show cart
    } else {
        cartDropdown.style.display = 'none'; // Hide cart
    }
}
