import React, { createContext, useState, useEffect } from "react";
import {
  recipeActions,
  handleRecipesChanged,
  setSetRecipesData,
} from "./ApiRecipeActions";

export const RecipesDataContext = createContext();
export const RecipesActionsContext = createContext();

export function RecipesProvider(props) {
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    loading: false,
  });

  setSetRecipesData(setRecipesData);

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
