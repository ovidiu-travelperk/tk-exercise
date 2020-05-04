from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from parameterized import parameterized

from core.models import Recipe
from recipe.serializers import RecipeSerializer

RECIPES_URL = reverse("recipe:recipe-list")


def sample_recipe(**params):
    defaults = {
        'name': 'my recipe',
        'description': 'very good'
    }

    defaults.update(params)

    return Recipe.objects.create(**defaults)


def detail_url(recipe_id):
    return reverse('recipe:recipe-detail', args=[recipe_id])


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
        ('', {'name': 'test'}),
        ('', {'name': 'test', 'description': 'desc'}),
    ])
    def test_create_recipe(self, name, recipe):
        payload = recipe

        res = self.client.post(RECIPES_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        recipe = Recipe.objects.get(id=res.data['id'])

        for key in payload.keys():
            self.assertEqual(payload[key], getattr(recipe, key))

    @parameterized.expand([
        ('', {'name': ''}),
        ('', {'name': '', 'description': 'changed'}),
        ('', {'description': 'changed'})
    ])
    def test_create_recipe_incomplete(self, name, incomplete_recipe):
        payload = incomplete_recipe

        res = self.client.post(RECIPES_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
