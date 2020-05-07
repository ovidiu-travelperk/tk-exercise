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

  const handleRenameRecipe = (oldValue, newValue) => {
    if (!Boolean(newValue) || !Boolean(newValue.trim())) return;
    updateRecipe({
      name: newValue,
    });
  };

  const handleAddIngredient = (oldValue, newValue) => {
    if (!Boolean(newValue.trim())) return;
    updateRecipe({
      ingredients: [...(ingredients || []), { name: newValue }],
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
        <EditableValue value={name} onValueChanged={handleRenameRecipe} />
      </h2>

      {ingredients && ingredients.length ? (
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
      <div>
        <EditableValue
          value=""
          onValueChanged={handleAddIngredient}
          onlyEdit
          placeholder="&#xf067; Add ingredient..."
        />
      </div>
    </div>
  );
}

export default RecipeDetail;
