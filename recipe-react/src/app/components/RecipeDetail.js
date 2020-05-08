import React from "react";
import IngredientItem from "./IngredientItem";
import EditableField from "./EditableField";

function RecipeDetail({ recipe, onUpdate }) {
  const {id, name, ingredients} = recipe;

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
      ...recipe,
      ...recipeValues,
    };

    if (onUpdate) onUpdate(modifiedRecipe);
  };

  return (
    <div>
      <h1>Recipe Detail</h1>
      <h2>
        <EditableField value={name} onValueChanged={handleRenameRecipe} />
      </h2>

      {ingredients && ingredients.length ? (
        <ul>
          {ingredients.map((ingredient) => {
            return (
              <li key={ingredient.name}>
                <IngredientItem
                  key={ingredient.name}
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
        <EditableField
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
