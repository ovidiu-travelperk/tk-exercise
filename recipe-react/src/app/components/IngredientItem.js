import React, { useState, useEffect } from "react";
import { useInputState } from "../hooks/useInputState";
import EditableValue from "./EditableValue";

function IngredientItem({ ingredient, onRename }) {
  const handleRename = (oldName, newName) => {
    if (onRename) onRename(ingredient, newName);
  };

  return (
    <div>
      <EditableValue value={ingredient.name} onValueChanged={handleRename} />
    </div>
  );
}

export default IngredientItem;
