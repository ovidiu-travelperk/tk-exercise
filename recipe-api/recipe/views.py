from rest_framework import viewsets
from core.models import Recipe, Ingredient
from recipe import serializers


class RecipeViewSet(viewsets.ModelViewSet):

    queryset = Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer

    def _ensure_ingredients_populated(self, request):
        return
        ingredients = request.data.get('ingredients', None)
        if not ingredients:
            request.data['ingredients'] = []

    def create(self, request, *args, **kwargs):
        self._ensure_ingredients_populated(request)

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self._ensure_ingredients_populated(request)

        return super().update(request, *args, **kwargs)


class IngredientViewSet(viewsets.ModelViewSet):

    queryset = Ingredient.objects.all()
    serializer_class = serializers.IngredientSerializer
