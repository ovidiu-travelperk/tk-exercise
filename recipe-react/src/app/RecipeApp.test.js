import React from "react";
import { render, wait, cleanup, waitForElement, waitForElementToBeRemoved } from "@testing-library/react";
import RecipeApp from "./RecipeApp";
import { getRecipes } from "../data/recipe/api";
import "@testing-library/jest-dom";
import { recipeFabricator } from "../data/recipe/fabricators";

jest.mock("../data/recipe/api");

function renderRecipeApp() {
  return render(<RecipeApp />);
}

describe("RecipeApp", () => {
  afterEach(cleanup);

  test("should call getRecipes at start", async () => {
    const recipes = recipeFabricator.times(10);
    getRecipes.mockReturnValueOnce({ data: recipes });

    const { getByTestId } = renderRecipeApp();

    expect(getRecipes).toHaveBeenCalledTimes(1);
    expect(getRecipes).toHaveBeenCalledWith();

    await waitForElementToBeRemoved(() => getByTestId("Loading"))

    recipes.forEach((recipe) =>
      validateSingleRecipeListing({ recipe, getByTestId })
    );
  });
});

function validateSingleRecipeListing({ recipe, getByTestId }) {
    expect(getByTestId(`Recipe-${recipe.id}`)).toHaveTextContent(recipe.name);
}
