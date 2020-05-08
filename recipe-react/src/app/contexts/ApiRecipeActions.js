import * as api from "../../data/recipe/api";

let setRecipesData;
const setSetRecipesData = (handler) => {
  setRecipesData = handler;
};

const handleRecipesChanged = (recipesData) => {};

const recipeActionsBuilder = () => {
  const refreshRecipes = async () => {
    const result = await api.getRecipes();
    setRecipesData(() => ({
      recipes: result.data,
      loading: false,
    }));
  };
  const loadRecipe = async (recipeId) => {
    const result = await api.getRecipe(recipeId);
    const recipe = result.data;
    setRecipesData((currentRecipeData) => {
      const currentRecipes = [...currentRecipeData.recipes];
      const existingRecipeIndex = currentRecipes.findIndex(
        (r) => r.id == recipeId
      );

      if (existingRecipeIndex > -1)
        currentRecipes[existingRecipeIndex] = recipe;
      else currentRecipes.push(recipe);

      return {
        ...currentRecipeData,
        recipes: currentRecipes,
      };
    });
  };
  const updateRecipe = async (recipe) => {
    const result = await api.updateRecipe(recipe);
    const resultRecipe = result.data;
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.map((rcp) =>
        rcp.id === recipe.id ? { ...rcp, ...resultRecipe } : rcp
      ),
    }));
  };
  const addRecipe = async (recipe) => {
    recipe = {
      ingredients: [],
      name: "New recipe",
      ...recipe,
    };
    const result = await api.addRecipe(recipe);
    const resultRecipe = result.data;
    setRecipesData((data) => ({
      ...data,
      recipes: [...data.recipes, resultRecipe],
      lastAddedRecipeId: resultRecipe.id,
    }));
  };

  const deleteRecipe = async (recipe) => {
    await api.deleteRecipe(recipe.id);
    setRecipesData((data) => ({
      ...data,
      recipes: data.recipes.filter((rcp) => rcp.id !== recipe.id),
    }));
  };

  return { refreshRecipes, loadRecipe, addRecipe, updateRecipe, deleteRecipe };
};
const recipeActions = recipeActionsBuilder();
export { recipeActions, setSetRecipesData, handleRecipesChanged };
