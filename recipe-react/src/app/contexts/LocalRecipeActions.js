import { recipeFabricator } from "../../data/recipe/fabricators";
import { v4 as uuidv4 } from "uuid";

let setRecipesData;
const setSetRecipesData = (handler) => {
  setRecipesData = handler;
};

const defaultRecipes = recipeFabricator.times(10);
const localRecipes = () =>
  JSON.parse(localStorage.getItem("recipes")) || defaultRecipes;

const handleRecipesChanged = (recipesData) => {
  localStorage.setItem("recipes", JSON.stringify(recipesData.recipes));
};

const recipeActions = {
  refreshRecipes: () => {
    setRecipesData(() => ({
      recipes: localRecipes(),
      loading: false,
    }));
  },
  updateRecipe: (recipe) => {
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.map((rcp) =>
        rcp.id === recipe.id ? { ...rcp, ...recipe } : rcp
      ),
    }));
  },
  addRecipe: (recipe) => {
    recipe = {
      ingredients: [],
      name: "New recipe",
      ...recipe,
      id: uuidv4(),
    };

    setRecipesData((data) => ({
      ...data,
      recipes: [...data.recipes, recipe],
      lastAddedRecipeId: recipe.id,
    }));
  },
  deleteRecipe: (recipe) => {
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.filter((rcp) => rcp !== recipe),
    }));
  },
};

export { recipeActions, handleRecipesChanged, setSetRecipesData };
