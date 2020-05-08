import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useInputState } from "../hooks/useInputState";

const EditableField = ({ value, onValueChanged, onlyEdit, placeholder }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [newValue, handleValueChange, resetNewValue] = useInputState(
    () => value
  );

  useEffect(resetNewValue, [value]);

  const changeValue = (e) => {
    if (e) e.preventDefault();
    setIsEdited(false);
    if (newValue === value) return;

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
};

EditableField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
  onValueChanged: PropTypes.func, 
  onlyEdit: PropTypes.bool, 
  placeholder: PropTypes.string
}

export default EditableField;
