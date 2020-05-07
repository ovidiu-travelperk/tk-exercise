import React, { createContext, useState } from "react";
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
  const mockRecipes = recipeFabricator.times(10);
  const recipeActions = {
    refreshRecipes: () => {
      setRecipesData(() => ({
        recipes: mockRecipes,
        loading: false,
      }));
    },
  };

  return recipeActions;
};

export function RecipesProvider(props) {
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    loading: false,
  });

  const recipeActions = localRecipeActions(()=> recipesData, setRecipesData);

  return (
    <RecipesDataContext.Provider value={recipesData}>
      <RecipesActionsContext.Provider value={recipeActions}>
        {props.children}
      </RecipesActionsContext.Provider>
    </RecipesDataContext.Provider>
  );
}
