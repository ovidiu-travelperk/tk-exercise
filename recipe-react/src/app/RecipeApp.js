import React from "react";
import RecipeList from "./components/RecipeList";
import { RecipesProvider } from "./contexts/RecipesContext";

function RecipeApp() {
  return (
    <div>
      <div>Recipe App!</div>
      <RecipesProvider>
        <RecipeList />
      </RecipesProvider>
    </div>
  );
}

export default RecipeApp;
