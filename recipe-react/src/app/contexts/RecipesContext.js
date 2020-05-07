import React, { createContext, useState, useEffect } from "react";
import {
  getRecipes,
  updateRecipe,
  deleteRecipe,
  addRecipe,
} from "../../data/recipe/api";
import { recipeFabricator } from "../../data/recipe/fabricators";
import { v4 as uuidv4 } from "uuid";

export const RecipesDataContext = createContext();
export const RecipesActionsContext = createContext();

const apiRecipeActions = (getRecipesData, setRecipesData) => {
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
      const result = await deleteRecipe(recipe);
      setRecipesData((data) => ({
        ...data,
        recipes: data.recipes.filter((rcp) => rcp.id !== recipe.id),
      }));
    },
  };

  return { recipeActions };
};

const localRecipeActions = (getRecipesData, setRecipesData) => {
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

  return { recipeActions, handleRecipesChanged };
};

export function RecipesProvider(props) {
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    loading: false,
  });

  const { recipeActions, handleRecipesChanged } = apiRecipeActions(
    () => recipesData,
    setRecipesData
  );

  useEffect(() => {
    if (handleRecipesChanged) handleRecipesChanged(recipesData);
  }, [recipesData]);

  return (
    <RecipesDataContext.Provider value={recipesData}>
      <RecipesActionsContext.Provider value={recipeActions}>
        {props.children}
      </RecipesActionsContext.Provider>
    </RecipesDataContext.Provider>
  );
}
