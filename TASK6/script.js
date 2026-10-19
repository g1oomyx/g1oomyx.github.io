
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('price-form');
    const quantityInput = document.getElementById('quantity');
    const optionSelect = document.getElementById('option');
    const optionSection = document.getElementById('options-section');
    const optionHelp = document.getElementById('option-help');
    const propertySection = document.getElementById('property-section');
    const giftWrapCheckbox = document.getElementById('gift-wrap');
    const unitPriceOutput = document.getElementById('unit-price');
    const totalPriceOutput = document.getElementById('total-price');
    const calculationNote = document.getElementById('calculation-note');
    const errorMessage = document.getElementById('error-message');
    const typeInputs = document.querySelectorAll(
        'input[name="product-type"]'
    );

    const products = {
        basic: {
            price: 800,
            options: [
                { value: 'none', label: 'Без дополнений', price: 0 },
                { value: 'size', label: 'Большой размер', price: 100 },
                { value: 'color', label: 'Дополнительный цвет', price: 150 }
            ],
            hasProperty: false
        },
        print: {
            price: 1100,
            options: [
                { value: 'none', label: 'Без дополнений', price: 0 },
                { value: 'size', label: 'Большой размер', price: 100 },
                { value: 'color', label: 'Дополнительный цвет', price: 150 },
                { value: 'large-print', label: 'Большой принт', price: 250 }
            ],
            hasProperty: false
        },
        premium: {
            price: 1500,
            options: [],
            hasProperty: true
        }
    };

    const moneyFormatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
    });

    function getSelectedType() {
        const selectedInput = document.querySelector(
            'input[name="product-type"]:checked'
        );

        return selectedInput ? selectedInput.value : 'basic';
    }

    function getSelectedOptionPrice(product) {
        const selectedOption = product.options.find(function (option) {
            return option.value === optionSelect.value;
        });

        return selectedOption ? selectedOption.price : 0;
    }

    function renderOptions(product) {
        optionSelect.replaceChildren();

        product.options.forEach(function (option) {
            const optionElement = document.createElement('option');

            optionElement.value = option.value;
            optionElement.textContent = option.label + ' (+' +
                moneyFormatter.format(option.price) + ')';

            optionSelect.appendChild(optionElement);
        });

        optionSection.hidden = product.options.length === 0;
        optionSelect.disabled = product.options.length === 0;

        optionHelp.textContent = product.options.length > 0
            ? 'Опции и доплаты зависят от типа товара'
            : 'Для этого типа товара дополнительные опции не предусмотрены';

        propertySection.hidden = !product.hasProperty;
        giftWrapCheckbox.checked = false;
    }

    function calculatePrice() {
        const product = products[getSelectedType()];
        const quantity = Number(quantityInput.value);

        errorMessage.hidden = true;
        errorMessage.textContent = '';

        if (!Number.isInteger(quantity) ||
            quantity < 1 || quantity > 1000) {
            unitPriceOutput.textContent = '—';
            totalPriceOutput.textContent = '—';
            calculationNote.textContent =
                'Введите целое количество от 1 до 1000.';

            errorMessage.textContent =
                'Количество должно быть целым числом от 1 до 1000.';
            errorMessage.hidden = false;
            return;
        }

        const optionPrice = getSelectedOptionPrice(product);
        const propertyPrice = product.hasProperty &&
            giftWrapCheckbox.checked ? 200 : 0;

        const unitPrice = product.price + optionPrice + propertyPrice;
        const totalPrice = unitPrice * quantity;

        unitPriceOutput.textContent = moneyFormatter.format(unitPrice);
        totalPriceOutput.textContent = moneyFormatter.format(totalPrice);

        calculationNote.textContent = quantity + ' шт. × ' +
            moneyFormatter.format(unitPrice) + ' за штуку';

        if (product.hasProperty && giftWrapCheckbox.checked) {
            calculationNote.textContent +=
                ' (включая подарочную упаковку)';
        }
    }

    function handleTypeChange() {
        const product = products[getSelectedType()];

        renderOptions(product);
        calculatePrice();
    }

    typeInputs.forEach(function (input) {
        input.addEventListener('change', handleTypeChange);
    });

    quantityInput.addEventListener('input', calculatePrice);
    optionSelect.addEventListener('change', calculatePrice);
    giftWrapCheckbox.addEventListener('change', calculatePrice);

    form.addEventListener('reset', function () {
        window.setTimeout(function () {
            handleTypeChange();
        }, 0);
    });

    handleTypeChange();
});
