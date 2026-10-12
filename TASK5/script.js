‘use strict’;

document.addEventListener(‘DOMContentLoaded’, function () {
const orderForm = document.getElementById(‘order-form’);
const productSelect = document.getElementById(‘product’);
const quantityInput = document.getElementById(‘quantity’);
const errorMessage = document.getElementById(‘error-message’);
const result = document.getElementById(‘result’);
const resultText = document.getElementById(‘result-text’);

orderForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const quantityText = quantityInput.value.trim();
    if (!/^\d+$/.test(quantityText)) {
        showError('Введите количество целым положительным числом.');
        return;
    }
    const quantity = parseInt(quantityText, 10);
    if (quantity < 1) {
        showError('Количество должно быть не меньше 1.');
        return;
    }
    const price = parseInt(productSelect.value, 10);
    const productName =
        productSelect.options[productSelect.selectedIndex].text
            .split(' — ')[0];
    const total = price * quantity;
    errorMessage.textContent = '';
    resultText.textContent =
        productName + ': ' +
        quantity + ' шт. × ' +
        formatPrice(price) + ' = ' +
        formatPrice(total);
    result.hidden = false;
});
function showError(message) {
    errorMessage.textContent = message;
    result.hidden = true;
}
function formatPrice(value) {
    return value.toLocaleString('ru-RU') + ' ₽';
}

});
