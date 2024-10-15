const orderList = document.getElementById('order-list');
const totalPriceElement = document.getElementById('total-price');
let total = 0;

// Add to Cart functionality
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item');
        const itemPrice = parseFloat(button.getAttribute('data-price'));
        
        // Add item to order list
        const li = document.createElement('li');
        li.textContent = `${itemName} - $${itemPrice.toFixed(2)}`;
        orderList.appendChild(li);
        
        // Update total price
        total += itemPrice;
        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
