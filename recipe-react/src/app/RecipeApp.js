import React from "react";
import RecipeList from "./components/RecipeList";
import { RecipesProvider } from "./contexts/RecipesContext";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import RecipeDetail from "./components/RecipeDetail";
import RecipeDetailLoader from "./components/RecipeDetailLoader";

function RecipeApp() {
  return (
    <Router>
      <div>
        <div>Recipe App!</div>
        <RecipesProvider>
          <Switch>
            <Route exact path="/">
              <RecipeList />
            </Route>
            <Route path="/recipes/:recipeId">
              <RecipeDetailLoader />
            </Route>
            <Route path="/">
              <RecipeList />
            </Route>
          </Switch>
        </RecipesProvider>
      </div>
    </Router>
  );
  // return (
  //   <div>
  //     <div>Recipe App!</div>
  //     <RecipesProvider>
  //       <RecipeList />
  //     </RecipesProvider>
  //   </div>
  // );
}

export default RecipeApp;
