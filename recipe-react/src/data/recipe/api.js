import axios from "axios";

const RECIPES_URL = "http://localhost:8000/api/recipe/recipes/";
const getDetailUrl = (recipeId) => {
  return `${RECIPES_URL}${recipeId}/`;
};

export const getRecipes = async () => {
  return await axios.get(RECIPES_URL);
};

export const getRecipe = async (recipeId) => {
  return await axios.get(getDetailUrl(recipeId));
};

export const addRecipe = async (recipe) => {
  return await axios.post(RECIPES_URL, recipe);
};

export const updateRecipe = async (recipe) => {
  return await axios.patch(getDetailUrl(recipe.id), recipe);
};

export const deleteRecipe = async (recipeId) => {
  return await axios.delete(getDetailUrl(recipeId));
};
