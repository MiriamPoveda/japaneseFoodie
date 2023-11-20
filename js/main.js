"use strict";

import { fetchRestaurants } from "./services/data.js";

const restaurantsList = document.getElementById("restaurantsList");
let activeRestaurant = null;
const filterInput = document.getElementById("restaurantFilter");
const bookingForm = document.getElementById("bookingForm");
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

// Simulación de envío de reserva

async function handleBookingSend(event) {
  event.preventDefault();

  if (activeRestaurant) {
    const formData = new FormData(bookingForm);
    const bookingData = {};

    formData.forEach((value, key) => {
      bookingData[key] = value;
    });

    bookingData["selectedRestaurant"] = activeRestaurant.querySelector(
      ".restaurants__restaurantsTitles"
    ).textContent;

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

      // Limpiar la selección de restaurante y reinicia el formulario
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

renderRestaurants();
