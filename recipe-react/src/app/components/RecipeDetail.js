import React from "react";

function RecipeDetail({ id, name, ingredients }) {
  return (
    <div>
      <div>{name}</div>
      {ingredients ? (
        <ul>
          {ingredients.map((ingredient) => (
            <div key={ingredient.name}>{ingredient.name}</div>
          ))}
        </ul>
      ) : (
        <div>No ingredients</div>
      )}
    </div>
  );
}

export default RecipeDetail;
