import React from "react";
import EditableValue from "./EditableValue";

function IngredientItem({ ingredient, onRename, onDelete }) {
  const handleRename = (oldName, newName) => {
    if (!Boolean(newName) || !Boolean(newName.trim())) handleDelete();
    else if (onRename) onRename(ingredient, newName);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(ingredient);
  };

  return (
    <div>
      <EditableValue value={ingredient.name} onValueChanged={handleRename} />
      <div onClick={handleDelete}>
        <i className="far fa-trash-alt"></i>
      </div>
    </div>
  );
}

export default IngredientItem;
