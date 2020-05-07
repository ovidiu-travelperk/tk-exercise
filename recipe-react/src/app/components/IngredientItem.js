import React from "react";
import EditableField from "./EditableField";

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
      <EditableField value={ingredient.name} onValueChanged={handleRename} />
      <div onClick={handleDelete}>
        <i className="far fa-trash-alt"></i>
      </div>
    </div>
  );
}

export default IngredientItem;
