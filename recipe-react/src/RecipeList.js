import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecipeList() {

    useEffect(() => {
        console.log('initial load');
        async function getRecipes() {
            // return await axios.get("http://localhost:8000/api/recipe/recipes/");
            const rs = await axios.get("http://localhost:8000/api/recipe/recipes/");
            console.log(rs);
            return rs;
        }

        getRecipes();
    }, [])

    return (
        <div>Recipe list here</div>
    );
}

export default RecipeList;