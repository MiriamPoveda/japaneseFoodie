"use strict";

import { fetchRestaurants } from "./services/data.js";

let activeRestaurant = null;

async function renderRestaurants() {
  const data = await fetchRestaurants();
  const restaurantsList = document.getElementById("restaurantsList");

  data.forEach((item) => {
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

    restaurantsList.appendChild(eachRestaurant);

    const restaurantLogo = eachRestaurant.querySelector(
      ".restaurants__restaurantsLogos"
    );

    restaurantLogo.addEventListener("click", function () {
      if (activeRestaurant === eachRestaurant.querySelector(".restaurants")) {
        activeRestaurant.classList.toggle("active");
      } else {
        if (activeRestaurant) {
          activeRestaurant.classList.remove("active");
        }
        eachRestaurant.querySelector(".restaurants").classList.add("active");
        activeRestaurant = eachRestaurant.querySelector(".restaurants");
      }
    });
  });
}

renderRestaurants();
