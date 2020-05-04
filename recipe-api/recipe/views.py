from rest_framework import viewsets, mixins, status
from core.models import Recipe
from recipe import serializers


class RecipeViewSet(viewsets.ModelViewSet):

    queryset = Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer
