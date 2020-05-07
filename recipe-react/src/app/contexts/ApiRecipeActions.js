import {
    getRecipes,
    updateRecipe,
    deleteRecipe,
    addRecipe,
  } from "../../data/recipe/api";
  
let setRecipesData;
const setSetRecipesData = (handler) => {
  setRecipesData = handler;
};

const handleRecipesChanged = (recipesData) => {};

const recipeActions = {
  refreshRecipes: async () => {
    const result = await getRecipes();
    setRecipesData(() => ({
      recipes: result.data,
      loading: false,
    }));
  },
  updateRecipe: async (recipe) => {
    const result = await updateRecipe(recipe);
    const resultRecipe = result.data;
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.map((rcp) =>
        rcp.id === recipe.id ? { ...rcp, ...resultRecipe } : rcp
      ),
    }));
  },
  addRecipe: async (recipe) => {
    recipe = {
      ingredients: [],
      name: "New recipe",
      ...recipe,
    };
    const result = await addRecipe(recipe);
    const resultRecipe = result.data;
    setRecipesData((data) => ({
      ...data,
      recipes: [...data.recipes, resultRecipe],
      lastAddedRecipeId: resultRecipe.id,
    }));
  },
  deleteRecipe: async (recipe) => {
    await deleteRecipe(recipe);
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.filter((rcp) => rcp.id !== recipe.id),
    }));
  },
};

export { recipeActions, setSetRecipesData, handleRecipesChanged };
