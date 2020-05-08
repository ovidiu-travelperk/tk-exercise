import React, { useContext, useEffect } from "react";
import RecipeDetail from "./RecipeDetail";
import { useParams } from "react-router-dom";
import {
  RecipesActionsContext,
  RecipesDataContext,
} from "../contexts/RecipesContext";

function RecipeDetailLoader() {
  const { recipeId } = useParams();
  const { loadRecipe, updateRecipe } = useContext(RecipesActionsContext);
  const { recipes } = useContext(RecipesDataContext);

  useEffect(() => {
    loadRecipe(recipeId);
  }, [loadRecipe, recipeId]);

  const renderRecipe = ()=>{
      if(!recipe)
      return;

      return(
          <div>
              <RecipeDetail recipe={recipe} onUpdate={updateRecipe}/>
          </div>
      )
  }
  const recipe = recipes.find((r) => r.id == recipeId);
  return (
    <div>
      <div>{recipeId}</div>
      {renderRecipe()}
    </div>
  );
}

export default RecipeDetailLoader;
