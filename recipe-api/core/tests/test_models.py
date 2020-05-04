from django.test import TestCase
from core import models


def sample_recipe():
    recipe = models.Recipe.objects.create(
        name='Pie',
        description='Very good pie'
    )

    return recipe


def sample_ingredient(**params):
    defaults = {
        "name": "my ingredient",
    }

    defaults.update(params)

    return models.Ingredient.objects.create(**defaults)


class ModelTests(TestCase):

    def test_recipe_str(self):
        recipe = sample_recipe()

        self.assertEqual(str(recipe), recipe.name)

    def test_ingredient_str(self):
        ingredient = models.Ingredient.objects.create(
            name='Pie',
            recipe=sample_recipe()
        )

        self.assertEqual(str(ingredient), ingredient.name)

    def test_create_recipe_with_ingredients(self):
        recipe = sample_recipe()
        recipe.ingredients.add(sample_ingredient(recipe=recipe))

        dbrecipe = models.Recipe.objects.all()[0]
        self.assertEqual(len(dbrecipe.ingredients.all()), 1)
