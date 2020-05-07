import React, { useState } from "react";
import IngredientItem from "./IngredientItem";
import EditableValue from "./EditableValue";

function RecipeDetail({ id, name, ingredients, onUpdate }) {
  const handleRenameIngredient = (ingredient, newName) => {
    updateRecipe({
      ingredients: ingredients.map((ing) =>
        ing === ingredient ? { ...ing, name: newName } : ing
      ),
    });
  };

  const handleDeleteIngredient = (ingredient) => {
    updateRecipe({
      ingredients: ingredients.filter((ing) => ing !== ingredient),
    });
  };

  const handleRecipeRename = (oldValue, newValue) => {
    updateRecipe({
      name: newValue,
    });
  };

  const updateRecipe = (recipeValues) => {
    const modifiedRecipe = {
      id,
      name,
      ingredients,
      ...recipeValues,
    };

    if (onUpdate) onUpdate(modifiedRecipe);
  };

  return (
    <div>
      <h1>Recipe Detail</h1>
      <h2>
        <EditableValue value={name} onValueChanged={handleRecipeRename} />
      </h2>

      {ingredients ? (
        <ul>
          {ingredients.map((ingredient) => {
            return (
              <li>
                <IngredientItem
                  ingredient={ingredient}
                  onRename={handleRenameIngredient}
                  onDelete={handleDeleteIngredient}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div>No ingredients</div>
      )}
    </div>
  );
}

export default RecipeDetail;
