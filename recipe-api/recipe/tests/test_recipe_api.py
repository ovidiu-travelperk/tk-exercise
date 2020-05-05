from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from parameterized import parameterized

from core.models import Recipe, Ingredient
from recipe.serializers import RecipeSerializer, SimpleIngredientSerializer

RECIPES_URL = reverse("recipe:recipe-list")


def sample_recipe(**params):
    defaults = {
        "name": "my recipe",
        "description": "very good"
    }

    defaults.update(params)

    return Recipe.objects.create(**defaults)


def sample_ingredient(**params):
    defaults = {
        "name": "my ingredient",
    }

    defaults.update(params)

    return Ingredient.objects.create(**defaults)


def detail_url(recipe_id):
    return reverse("recipe:recipe-detail", args=[recipe_id])


class PublicRecipeApiTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_access_recipes(self):
        res = self.client.get(RECIPES_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_view_recipes(self):
        sample_recipe()
        sample_recipe()

        res = self.client.get(RECIPES_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertEqual(len(res.data), 2)

    def test_view_recipe_detail(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)
        ingredient2 = sample_ingredient(recipe=recipe)

        url = detail_url(recipe.id)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        serializer = RecipeSerializer(recipe)
        ingredient_serializer = SimpleIngredientSerializer(ingredient2)

        self.assertEqual(res.data, serializer.data)
        self.assertEqual(len(res.data['ingredients']), 2)
        self.assertIn(ingredient_serializer.data, res.data['ingredients'])

    @parameterized.expand([
        ("", {"name": "test", "description": "desc"}),
        ("", {"name": "test recip", "description": "description"}),
    ])
    def test_create_recipe_no_ingredients(self, name, recipe):
        payload = recipe

        res = self.client.post(RECIPES_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        dbrecipe = Recipe.objects.get(id=res.data["id"])

        for key in payload.keys():
            self.assertEqual(payload[key], getattr(dbrecipe, key))

    @parameterized.expand([
        ("", {"name": ""}),
        ("", {"name": "", "description": "changed"}),
        ("", {"description": "changed"})
    ])
    def test_create_recipe_incomplete(self, name, incomplete_recipe):
        payload = incomplete_recipe

        res = self.client.post(RECIPES_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    @parameterized.expand([
        ("", {
            "name": "recip",
            "ingredients": [],
        }),
        ("", {
            "name": "recip",
            "ingredients": [{"name": "onion"}, {"name": "mustard"}],
        })
    ])
    def test_create_recipe_with_ingredients(self, name, recipe):
        payload = recipe

        res = self.client.post(RECIPES_URL, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        dbrecipe = Recipe.objects.get(id=res.data["id"])
        dbingredients = dbrecipe.ingredients.all()

        ingredients = payload["ingredients"]
        self.assertEqual(len(ingredients), len(dbingredients))

    def test_create_recipe_same_ingredients(self):
        ingredients = [{"name": "onion"}, {"name": "mustard"}]

        recipe1 = {"name": "recip1", "ingredients": ingredients}
        self.client.post(RECIPES_URL, recipe1, format="json")

        recipe2 = {
            "name": "recip2", "ingredients": [
                *ingredients, {
                    "name": "flour"}]}
        self.client.post(RECIPES_URL, recipe2, format="json")

        all_ingredients_count = Ingredient.objects.count()
        self.assertEqual(all_ingredients_count, 5)

    def test_patch_recipe_name(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)

        payload = {
            "name": "new recipe"
        }

        res = self.client.patch(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])

        all_ingredients_count = Ingredient.objects.count()
        self.assertEqual(all_ingredients_count, 1)

    def test_patch_recipe_description(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)

        payload = {
            "description": "new description"
        }

        res = self.client.patch(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        name = recipe.name
        recipe.refresh_from_db()
        self.assertEqual(recipe.name, name)
        self.assertEqual(recipe.description, payload['description'])

        all_ingredients_count = Ingredient.objects.count()
        self.assertEqual(all_ingredients_count, 1)

    def test_patch_recipe_ingredients(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)
        sample_ingredient(recipe=recipe)

        new_ingred = {"name": "banana"}
        payload = {
            "ingredients": [new_ingred]
        }

        res = self.client.patch(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipeName = recipe.name
        recipe.refresh_from_db
        self.assertEqual(recipe.name, recipeName)

        all_ingredients = Ingredient.objects.all()
        self.assertEqual(len(all_ingredients), 1)
        self.assertEqual(all_ingredients[0].name, new_ingred["name"])

    def test_put_recipe_name(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)

        payload = {
            "name": "new recipe",
            "description": ""
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])
        self.assertFalse(recipe.description)

        all_ingredients_count = Ingredient.objects.count()
        self.assertEqual(all_ingredients_count, 0)

    def test_put_recipe_ingredients(self):
        recipe = sample_recipe()

        payload = {
            "ingredients": []
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("required", str(res.data))

    def test_put_recipe_full(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)
        sample_ingredient(recipe=recipe)

        new_ingred = {"name": "banana"}
        payload = {
            "name": "new recipe",
            'description': "new description",
            "ingredients": [new_ingred],
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])
        self.assertEqual(recipe.description, payload["description"])

        all_ingredients = Ingredient.objects.all()
        self.assertEqual(len(all_ingredients), 1)
        self.assertEqual(all_ingredients[0].name, new_ingred["name"])
