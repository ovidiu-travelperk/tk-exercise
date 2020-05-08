import React, { useState, useEffect, useContext } from "react";
import RecipeDetail from "./RecipeDetail";
import {
  RecipesActionsContext,
  RecipesDataContext,
} from "../contexts/RecipesContext";
import EditableField from "./EditableField";
import RecipeItem from "./RecipeItem";
import { useHistory } from "react-router-dom";

function RecipeList() {
  const [selectedRecipeId, setSelectedRecipeId] = useState();
  const history = useHistory();

  const { refreshRecipes, updateRecipe, addRecipe, deleteRecipe } = useContext(
    RecipesActionsContext
  );
  const { recipes, loading, lastAddedRecipeId } = useContext(
    RecipesDataContext
  );

  useEffect(() => {
    refreshRecipes();
  }, [refreshRecipes]);

  useEffect(() => {
    setSelectedRecipeId(lastAddedRecipeId);
  }, [lastAddedRecipeId]);

  const handleAddRecipe = (oldName, newName) => {
    addRecipe({ name: newName });
  };

  const handleSelectRecipe = (recipe) => {
    //setSelectedRecipeId(recipe.id);
    history.push(`/recipes/${recipe.id}`)
  };

  const renderRecipes = () => {
    if (!recipes) return;

    return (
      <>
        <EditableField
          onlyEdit
          value=""
          onValueChanged={handleAddRecipe}
          placeholder="&#xf067; Add recipe..."
        />
        {recipes.map((recipe) => {
          const isSelected = selectedRecipeId === recipe.id;
          return (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
              onDelete={deleteRecipe}
              isSelected={isSelected}
            />
          );
        })}
      </>
    );
  };

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId);
  return (
    <div>
      <div>Recipe list here</div>
      <div style={{ border: "1px solid black" }}>
        {loading && <div data-testid="Loading">Loading</div>}
        {renderRecipes()}
      </div>
      {selectedRecipe && (
        <RecipeDetail recipe={selectedRecipe} onUpdate={updateRecipe} />
      )}
    </div>
  );
}

export default RecipeList;
