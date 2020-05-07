import React, { useState, useEffect, useContext } from "react";
import RecipeDetail from "./RecipeDetail";
import { RecipesActionsContext, RecipesDataContext } from "../contexts/RecipesContext";

function RecipeList() {

  const [selectedRecipe, setSelectedRecipe] = useState();

  const recipeActions = useContext(RecipesActionsContext)
  const {recipes, loading} = useContext(RecipesDataContext)

  useEffect(() => recipeActions.refreshRecipes(), []);

  const renderRecipes = () => {
    console.log(recipes);
    if (!recipes) return;

    return (
      <>
        {recipes.map((recipe, i) => (
          <div
            key={recipe.id}
            data-testid={`Recipe-${recipe.id}`}
            onClick={() => setSelectedRecipe(recipe)}
          >
            {recipe.name}
          </div>
        ))}
      </>
    );
  };

  return (
    <div>
      <div>Recipe list here</div>
      <div style={{border: "1px solid black"}}>
        {loading && <div data-testid="Loading">Loading</div>}
        {renderRecipes()}
      </div>
      {selectedRecipe && <RecipeDetail {...selectedRecipe} />}
    </div>
  );
}

export default RecipeList;
