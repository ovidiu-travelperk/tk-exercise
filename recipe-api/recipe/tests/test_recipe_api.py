from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from parameterized import parameterized

from core.models import Recipe, Ingredient
from recipe.serializers import RecipeSerializer

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

        url = detail_url(recipe.id)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        serializer = RecipeSerializer(recipe)

        self.assertEqual(res.data, serializer.data)

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
        (ing1, ing2) = ({"name": "onion"}, {"name": "mustard"})

        recipe1 = {"name": "recip1", "ingredients": [ing1, ing2]}
        self.client.post(RECIPES_URL, recipe1, format="json")

        recipe2 = {
            "name": "recip2", "ingredients": [
                ing1, ing2, {
                    "name": "flour"}]}
        self.client.post(RECIPES_URL, recipe2, format="json")

        allIngredientsCount = Ingredient.objects.count()
        self.assertEqual(allIngredientsCount, 5)

    def test_patch_recipe_name(self):
        recipe = sample_recipe()
        ing1 = sample_ingredient(recipe=recipe)

        payload = {
            "name": "new recipe"
        }

        res = self.client.patch(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])

        allIngredientsCount = Ingredient.objects.count()
        self.assertEqual(allIngredientsCount, 1)

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

        allIngredients = Ingredient.objects.all()
        self.assertEqual(len(allIngredients), 1)
        self.assertEqual(allIngredients[0].name, new_ingred["name"])

    def test_put_recipe_name(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)

        payload = {
            "name": "new recipe"
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])

        allIngredientsCount = Ingredient.objects.count()
        self.assertEqual(allIngredientsCount, 0)

    def test_put_recipe_ingredients(self):
        recipe = sample_recipe()

        payload = {
            "ingredients": []
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("required", str(res.data))

    def test_put_recipe(self):
        recipe = sample_recipe()
        sample_ingredient(recipe=recipe)
        sample_ingredient(recipe=recipe)

        new_ingred = {"name": "banana"}
        payload = {
            "name": "new recipe",
            "ingredients": [new_ingred]
        }

        res = self.client.put(detail_url(recipe.id), payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)

        recipe.refresh_from_db()
        self.assertEqual(recipe.name, payload["name"])

        allIngredients = Ingredient.objects.all()
        self.assertEqual(len(allIngredients), 1)
        self.assertEqual(allIngredients[0].name, new_ingred["name"])
