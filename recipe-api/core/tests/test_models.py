from django.test import TestCase
from core import models


class ModelTests(TestCase):

    def test_recipe_str(self):
        recipe = models.Recipe.objects.create(
            name='Pie',
            description='Very good pie'
        )

        self.assertEqual(str(recipe), recipe.name)
