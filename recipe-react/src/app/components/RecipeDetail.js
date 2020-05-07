import React, { useState } from "react";
import IngredientItem from "./IngredientItem";
import EditableValue from "./EditableValue";

function RecipeDetail({
  id,
  name,
  ingredients,
  renameIngredient,
  addIngredient,
  removeIngredient,
}) {
  const onRenameIngredient = (ingredient, newName) => {
    alert(`${ingredient.name} => ${newName}`);
  };
  return (
    <div>
      <h1>Recipe Detail</h1>
      <h2>
        <EditableValue value={name} />
      </h2>

      {ingredients ? (
        <ul>
          {ingredients.map((ingredient) => {
            return (
              <li>
                <IngredientItem
                  ingredient={ingredient}
                  onRenameIngredient={onRenameIngredient}
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
