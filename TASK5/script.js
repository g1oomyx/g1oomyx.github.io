
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');
    const product = document.getElementById('product');
    const quantity = document.getElementById('quantity');
    const error = document.getElementById('error-message');
    const result = document.getElementById('result');
    const resultText = document.getElementById('result-text');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const value = quantity.value.trim();

        if (!/^\d+$/.test(value) || Number(value) < 1) {
            error.textContent = 'Введите целое число больше нуля.';
            result.hidden = true;
            return;
        }

        const count = Number(value);
        const price = Number(product.value);
        const name = product.options[product.selectedIndex].text
            .split(' — ')[0];

        const total = price * count;

        error.textContent = '';
        resultText.textContent =
            name + ': ' + count + ' шт. × ' +
            price + ' ₽ = ' +
            total.toLocaleString('ru-RU') + ' ₽';

        result.hidden = false;
    });
});
