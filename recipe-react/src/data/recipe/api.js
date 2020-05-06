import axios from "axios";

const RECIPES_URL = "http://localhost:8000/api/recipe/recipes/";

const getRecipes = async () => {
  return await axios.get(RECIPES_URL);
};

export { getRecipes };
