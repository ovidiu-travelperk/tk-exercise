from rest_framework import serializers
from core import models


class RecipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Recipe
        fields = ('id', 'name', 'description',)
        read_only_fields = ('id',)
