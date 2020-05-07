import React, { useState, useEffect } from "react";
import { useInputState } from "../hooks/useInputState";

function EditableValue({ value, onValueChanged }) {
  const [isEdited, setIsEdited] = useState(false);
  const [newValue, handleValueChange, resetNewValue] = useInputState(
    () => value
  );

  useEffect(() => {
    resetNewValue();
  }, [value]);

  const changeValue = () => {
    setIsEdited(false);
    if (newValue == value) return;

    if (onValueChanged) onValueChanged(value, newValue);
    resetNewValue();
  };

  return (
    <div onClick={() => setIsEdited(true)} onBlur={changeValue}>
      {isEdited ? (
        <input
          autoFocus
          type="text"
          value={newValue}
          onChange={handleValueChange}
        />
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}

export default EditableValue;
