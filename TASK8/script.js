const openButton = document.getElementById("openForm");
const closeButton = document.getElementById("closeForm");
const overlay = document.getElementById("overlay");
const form = document.getElementById("contactForm");
const result = document.getElementById("result");
const submitButton = document.getElementById("submitButton");

const STORAGE_KEY = "contactFormData";

// Все поля формы
const fields = [
    "name",
    "email",
    "phone",
    "organization",
    "message"
];

// Открытие формы
function openForm() {
    if (overlay.classList.contains("active")) return;

    history.pushState({ modal: true }, "", "#contact");
    overlay.classList.add("active");

    restoreData();
}

// Закрытие формы
function closeForm() {
    if (overlay.classList.contains("active")) {
        history.back();
    }
}

// Закрытие окна при нажатии Назад
window.addEventListener("popstate", function () {
    overlay.classList.remove("active");
    result.textContent = "";
    result.className = "result";
});

// Кнопки открытия и закрытия
openButton.addEventListener("click", openForm);
closeButton.addEventListener("click", closeForm);

// Закрытие по клику на затемнение
overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
        closeForm();
    }
});

// Сохранение данных в LocalStorage
function saveData() {
    const data = {};

    fields.forEach(function (field) {
        data[field] = document.getElementById(field).value;
    });

    data.consent = document.getElementById("consent").checked;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Восстановление данных из LocalStorage
function restoreData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) return;

    const data = JSON.parse(savedData);

    fields.forEach(function (field) {
        if (data[field] !== undefined) {
            document.getElementById(field).value = data[field];
        }
    });

    document.getElementById("consent").checked =
        data.consent || false;
}

// Автоматическое сохранение при изменении полей
fields.forEach(function (field) {
    document.getElementById(field).addEventListener("input", saveData);
});

document.getElementById("consent").addEventListener("change", saveData);

// Очистка формы
function clearForm() {
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
}

// Отправка формы
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    result.textContent = "";
    result.className = "result";

    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    // Formcarry: замени FORM_ID на свой ID формы
    const formData = new FormData(form);

    formData.append(
        "consent",
        document.getElementById("consent").checked ? "Да" : "Нет"
    );

    try {
        const response = await fetch("https://formcarry.com/s/FORM_ID", {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json"
            }
        });

        const data = await response.json();

        if (response.ok && data.code === 200) {
            result.textContent = "Сообщение успешно отправлено!";
            result.classList.add("success");

            clearForm();
        } else {
            throw new Error("Ошибка отправки");
        }

    } catch (error) {
        result.textContent = "Ошибка отправки. Попробуйте ещё раз.";
        result.classList.add("error");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить сообщение ↗";
    }
});
