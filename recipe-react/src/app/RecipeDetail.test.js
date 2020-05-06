import React from "react";
import { recipeFabricator } from "../data/recipe/fabricators";
import { render } from "@testing-library/react";
import RecipeDetail from "./components/RecipeDetail";

describe("RecipeDetail", () => {
  test("should display recipe", () => {
    const recipe = recipeFabricator();

    const { getByText } = render(<RecipeDetail {...recipe} />);

    expect(getByText(recipe.name)).toBeInTheDocument();

    recipe.ingredients.forEach((ingredient) =>
      expect(getByText(ingredient.name)).toBeInTheDocument()
    );
  });

  test("should display recipe no ingredients", () => {
    const recipe = recipeFabricator({ingredients: null});

    const { getByText } = render(<RecipeDetail {...recipe} />);

    expect(getByText(recipe.name)).toBeInTheDocument();

    expect(getByText("No ingredients")).toBeInTheDocument();
  });
});
