import React, { createContext, useState } from "react";
import { getRecipes } from "../../data/recipe/api";

export const RecipesDataContext = createContext();
export const RecipesActionsContext = createContext();

export function RecipesProvider(props) {
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    loading: false,
  });

  const recipeActions = {
    refreshRecipes: async () => {
      const result = await getRecipes();
      setRecipesData(() => ({
        recipes: result.data,
        loading: false,
      }));
    },
  };
  return (
    <RecipesDataContext.Provider value={recipesData}>
      <RecipesActionsContext.Provider value={recipeActions}>
        {props.children}
      </RecipesActionsContext.Provider>
    </RecipesDataContext.Provider>
  );
}
