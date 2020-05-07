import React from "react";

function RecipeItem({ recipe, onSelect, onDelete, isSelected }) {
  const handleDelete = () => {
    if (onDelete) onDelete(recipe);
  };

  return (
    <div>
      <div
        key={recipe.id}
        data-testid={`Recipe-${recipe.id}`}
        onClick={() => onSelect(recipe.id)}
        style={isSelected ? { border: "1px solid" } : {}}
      >
        {recipe.name}
      </div>
      <div onClick={handleDelete}>
        <i class="far fa-trash-alt"></i>
      </div>
    </div>
  );
}

export default RecipeItem;
