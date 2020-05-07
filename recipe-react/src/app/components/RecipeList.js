import React, { useState, useEffect, useContext } from "react";
import RecipeDetail from "./RecipeDetail";
import {
  RecipesActionsContext,
  RecipesDataContext,
} from "../contexts/RecipesContext";

function RecipeList() {
  const [selectedRecipeId, setSelectedRecipeId] = useState();

  const { refreshRecipes, updateRecipe } = useContext(RecipesActionsContext);
  const { recipes, loading } = useContext(RecipesDataContext);

  useEffect(() => refreshRecipes(), []);

  const renderRecipes = () => {
    if (!recipes) return;

    return (
      <>
        {recipes.map((recipe, i) => {
          const isSelected = selectedRecipeId == recipe.id;
          return (
            <div
              key={recipe.id}
              data-testid={`Recipe-${recipe.id}`}
              onClick={() => setSelectedRecipeId(recipe.id)}
              style={isSelected ? { border: "1px solid" } : {}}
            >
              {recipe.name}
            </div>
          );
        })}
      </>
    );
  };

  const selectedRecipe = recipes.find((r) => r.id == selectedRecipeId);
  return (
    <div>
      <div>Recipe list here</div>
      <div style={{ border: "1px solid black" }}>
        {loading && <div data-testid="Loading">Loading</div>}
        {renderRecipes()}
      </div>
      {selectedRecipe && (
        <RecipeDetail {...selectedRecipe} onUpdate={updateRecipe} />
      )}
    </div>
  );
}

export default RecipeList;
