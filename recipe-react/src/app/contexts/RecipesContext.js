import React, { createContext, useState, useEffect } from "react";
import { getRecipes } from "../../data/recipe/api";
import { recipeFabricator } from "../../data/recipe/fabricators";

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
  };

  return recipeActions;
};

const localRecipeActions = (getRecipesData, setRecipesData) => {
  const defaultRecipes =  recipeFabricator.times(10);
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
  };

  return { recipeActions, handleRecipesChanged };
};

export function RecipesProvider(props) {
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    loading: false,
  });

  const { recipeActions, handleRecipesChanged } = localRecipeActions(
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
