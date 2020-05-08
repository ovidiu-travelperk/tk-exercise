import React from "react";
import EditableField from "./EditableField";
import PropTypes from 'prop-types'

const  IngredientItem = ({ ingredient, onRename, onDelete }) => {
  const handleRename = (oldName, newName) => {
    if (!newName || !newName.trim()) handleDelete();
    else if (onRename) onRename(ingredient, newName);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(ingredient);
  };

  return (
    <div>
      <EditableField value={ingredient.name} onValueChanged={handleRename} />
      <div onClick={handleDelete}>
        <i className="far fa-trash-alt"></i>
      </div>
    </div>
  );
}

IngredientItem.propTypes = {
  ingredient: PropTypes.object.isRequired,
  onRename: PropTypes.func,
  onDelete: PropTypes.func
}

export default IngredientItem;
