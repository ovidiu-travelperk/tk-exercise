from rest_framework import viewsets, mixins, status
from core.models import Recipe, Ingredient
from recipe import serializers


class RecipeViewSet(viewsets.ModelViewSet):

    queryset = Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer

    def create(self, request, *args, **kwargs):
        ingredients = request.data.get('ingredients', None)
        if not ingredients:
            request.data['ingredients'] = []

        return super().create(request, *args, **kwargs)


class IngredientViewSet(viewsets.ModelViewSet):

    queryset = Ingredient.objects.all()
    serializer_class = serializers.IngredientSerializer
