import React, { useState, useEffect } from "react";
import { getRecipes } from "../../data/recipe/api";
import { useAsync } from "react-use";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("initial load");
    (async () => {
      const result = await getRecipes();
      setRecipes(result.data);
      setLoading(false);
    })();
  }, []);

  const renderRecipes = () => {
    return (
      <div>
        {recipes.map((recipe, i) => (
          <div key={recipe.id} data-testid={`Recipe-${recipe.id}`}>
            {recipe.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>Recipe list here</div>
      {loading ? <div data-testid="Loading">Loading</div> : renderRecipes()}
    </div>
  );
}

export default RecipeList;
