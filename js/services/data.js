"use strict";

export async function fetchRestaurants() {
  try {
    const response = await fetch("../../data/restaurants.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar los restaurantes:", error);
    return [];
  }
}
