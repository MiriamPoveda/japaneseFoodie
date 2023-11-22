"use strict";

import { fetchRestaurants } from "./services/data.js";

const restaurantsList = document.getElementById("restaurantsList");
let activeRestaurant = null;
const filterInput = document.getElementById("restaurantFilter");
const bookingForm = document.getElementById("bookingForm");
const dateInput = document.getElementById("specialDate");
const nameInput = document.getElementById("firstName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("personalPhone");
const reservationMessage = document.getElementById("reservationMessage");

// Estructura para cada restaurante

function createRestaurant(item) {
  const eachRestaurant = document.createElement("li");
  eachRestaurant.setAttribute("data-restaurant-name", item.restaurant);
  eachRestaurant.innerHTML = `
    <div class="restaurants">
      <p class="restaurants__restaurantsTitles">${item.restaurant}</p>
      <img class="restaurants__restaurantsLogos" src="${item.businessLogo}" alt="${item.restaurant}"/>
      <p class="restaurants__restaurantsInfo">${item.description}</p>
      <div class="desktopImages">
        <img class="restaurantMeal meals" src="${item.imageOne}" alt="Meal" />
        <img id="mealTwo" class="restaurantMeal meals" src="${item.imageTwo}" alt="Meal" />
        <img class="restaurantMeal meals" src="${item.imageThree}" alt="Meal" />
      </div>
    </div>
  `;
  return eachRestaurant;
}

// Renderizado de los restaurantes

async function renderRestaurants() {
  const data = await fetchRestaurants();
  const restaurantsList = document.getElementById("restaurantsList");

  data.forEach((item) => {
    const eachRestaurant = createRestaurant(item);
    restaurantsList.appendChild(eachRestaurant);
  });
}

// Filtro para buscar por nombre

function filterRestaurantsByName() {
  const filterInput = document.getElementById("restaurantFilter");
  const filterValue = filterInput.value.toLowerCase();

  const restaurantItems = document.querySelectorAll("[data-restaurant-name]");
  const noResultsMessage = document.getElementById("noResultsMessage");

  let foundMatch = false;

  restaurantItems.forEach((item) => {
    const restaurantName = item
      .getAttribute("data-restaurant-name")
      .toLowerCase();
    if (restaurantName.includes(filterValue)) {
      item.classList.remove("hidden");
      foundMatch = true;
    } else {
      item.classList.add("hidden");
    }
  });

  // Mostrar u ocultar mensaje (si se encontraron (o no) restaurantes)

  if (foundMatch) {
    noResultsMessage.classList.add("hidden");
  } else {
    noResultsMessage.classList.remove("hidden");
  }
}

// Simulación de selección de restaurante

function handleRestaurantClick(event) {
  const clickedRestaurant = event.target.closest(".restaurants");
  if (clickedRestaurant) {
    if (clickedRestaurant === activeRestaurant) {
      clickedRestaurant.classList.remove("active");
      activeRestaurant = null;
    } else {
      if (activeRestaurant) {
        activeRestaurant.classList.remove("active");
      }
      clickedRestaurant.classList.add("active");
      activeRestaurant = clickedRestaurant;
    }
  }
}

// Validaciones del formulario

function handleInputValidation() {
  validateNameInput();
  validatePhoneInput();
  validateEmailInput();
}

// Validación del campo de nombre
function validateNameInput() {
  const nameValue = nameInput.value;
  const filteredCharacters = /^[a-zA-ZáãéíóõúüÜÁÃÉÍÓÕÚÑñ\s-AEIOUaeiou]+$/;
  const filteredName = nameValue
    .split("")
    .filter((char) => filteredCharacters.test(char))
    .join("");
  nameInput.value = filteredName;
}

// Validación del campo de email
function validateEmailInput() {
  const emailValue = emailInput.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(emailValue);
}

// Validación del campo del teléfono
function validatePhoneInput() {
  const phoneValue = phoneInput.value;
  const numericPhone = phoneValue.replace(/\D/g, "");
  const limitedPhone = numericPhone.slice(0, 9);
  phoneInput.value = limitedPhone;
  return limitedPhone.length === 9;
}

// Validación del campo de fecha
function handleDateValidation() {
  const today = new Date();
  // Sólo permite seleccionar días posteriores al actual
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];
  dateInput.setAttribute("min", formattedTomorrow);
  // Muestra un máximo de 30 días posteriores
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30
  );
  const formattedMaxDate = maxDate.toISOString().split("T")[0];
  dateInput.setAttribute("max", formattedMaxDate);
}

function validateForm() {
  // Verificación de restaurante seleccionado
  if (!activeRestaurant) {
    alert("Por favor, selecciona un restaurante antes de enviar la reserva.");
    return false;
  }

  handleInputValidation();

  return true;
}

// Simulación de envío de reserva

async function handleBookingSend(event) {
  event.preventDefault();
  const isPhoneValid = validatePhoneInput();
  const isEmailValid = validateEmailInput();

  // Comprobar validaciones al intentar enviar
  if (!validateForm()) {
    return;
  }

  if (activeRestaurant) {
    const formData = new FormData(bookingForm);
    const bookingData = {};

    formData.forEach((value, key) => {
      bookingData[key] = value;
    });

    bookingData["selectedRestaurant"] = activeRestaurant.querySelector(
      ".restaurants__restaurantsTitles"
    ).textContent;

    // Mostrar alerta si el número de teléfono no es válido
    if (!isPhoneValid) {
      alert("Por favor, ingresa un número de teléfono válido con 9 dígitos.");
      return;
    }

    // Mostrar alerta si el email no es válido
    if (!isEmailValid) {
      alert("Por favor, ingresa un email válido.");
      return;
    }

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la reserva");
      }

      const responseData = await response.json();

      // Simular reserva a través de la consola
      console.log("Reserva enviada con éxito:", responseData);

      // Limpiar la selección de restaurante y reiniciar el formulario
      activeRestaurant.classList.remove("active");
      activeRestaurant = null;
      bookingForm.reset();
      reservationMessage.classList.remove("hidden");

      setTimeout(() => {
        reservationMessage.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error al enviar la reserva:", error.message);
    }
  }
}

restaurantsList.addEventListener("click", handleRestaurantClick);
filterInput.addEventListener("input", filterRestaurantsByName);
bookingForm.addEventListener("submit", handleBookingSend);
dateInput.addEventListener("input", handleDateValidation);
nameInput.addEventListener("input", handleInputValidation);
emailInput.addEventListener("input", handleInputValidation);
phoneInput.addEventListener("input", handleInputValidation);

renderRestaurants();
