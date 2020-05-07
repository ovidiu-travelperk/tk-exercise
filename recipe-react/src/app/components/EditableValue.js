import React, { useState, useEffect } from "react";
import { useInputState } from "../hooks/useInputState";

function EditableValue({ value, onValueChanged, onlyEdit, placeholder }) {
  const [isEdited, setIsEdited] = useState(false);
  const [newValue, handleValueChange, resetNewValue] = useInputState(
    () => value
  );

  useEffect(() => {
    resetNewValue();
  }, [value]);

  const changeValue = (e) => {
    if (e) e.preventDefault();
    setIsEdited(false);
    if (newValue == value) return;

    if (onValueChanged) onValueChanged(value, newValue);
    resetNewValue();
  };

  return (
    <div onClick={() => setIsEdited(true)}>
      {isEdited || onlyEdit ? (
        <form onSubmit={changeValue}>
          <input
            autoFocus
            type="text"
            value={newValue}
            onChange={handleValueChange}
            onBlur={changeValue}
            style={{ fontFamily: "FontAwesome, Arial", padding: "2px" }}
            placeholder={placeholder}
          />
        </form>
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
}

export default EditableValue;
