"use strict";

import { fetchRestaurants } from "./services/data.js";

const restaurantsList = document.getElementById("restaurantsList");
let activeRestaurant = null;
const bookingForm = document.getElementById("bookingForm");

// Estructura para cada restaurante

function createRestaurant(item) {
  const eachRestaurant = document.createElement("li");
  eachRestaurant.innerHTML = `
    <div class="restaurants">
      <p class="restaurants__restaurantsTitles">${item.restaurant}</p>
      <img class="restaurants__restaurantsLogos" src="${item.businessLogo}" alt="${item.restaurant}"/>
      <p class="restaurants__restaurantsInfo">${item.description}</p>
      <div>
        <img class="restaurantMeal" src="${item.imageOne}" alt="Meal" />
        <img id="mealTwo" class="restaurantMeal" src="${item.imageTwo}" alt="Meal" />
        <img class="restaurantMeal" src="${item.imageThree}" alt="Meal" />
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

// Simulación de envío de formulario

function handleBookingSend(event) {
  event.preventDefault();
  bookingForm.reset();
}

restaurantsList.addEventListener("click", handleRestaurantClick);
bookingForm.addEventListener("submit", handleBookingSend);

renderRestaurants();
