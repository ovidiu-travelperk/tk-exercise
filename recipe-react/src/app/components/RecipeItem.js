import React from "react";
import PropTypes from 'prop-types'

const  RecipeItem = ({ recipe, onSelect, onDelete, isSelected }) => {
  const handleDelete = () => {
    if (onDelete) onDelete(recipe);
  };


  return (
    <div>
      <div
        key={recipe.id}
        data-testid={`Recipe-${recipe.id}`}
        onClick={() => onSelect(recipe)}
        style={isSelected ? { border: "1px solid" } : {}}
      >
        {recipe.name}
      </div>
      <div onClick={handleDelete}>
        <i className="far fa-trash-alt"></i>
      </div>
    </div>
  );
}

RecipeItem.propTypes = {
    recipe: PropTypes.object.isRequired,
    onSelect: PropTypes.func, 
    onDelete: PropTypes.func, 
    isSelected: PropTypes.bool
}

export default RecipeItem;
