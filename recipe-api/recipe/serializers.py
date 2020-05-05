from rest_framework import serializers
from core.models import Ingredient, Recipe


class SimpleIngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ('name',)


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ('name', 'recipe',)


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = SimpleIngredientSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = ('id', 'name', 'description', 'ingredients',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        ingredients_validated_data = validated_data.pop('ingredients', None)
        recipe = super().create(validated_data)

        if ingredients_validated_data:
            for ingredient in ingredients_validated_data:
                ingredient['recipe'] = recipe

            ingredient_set_serializer = self.fields['ingredients']
            ingredient_set_serializer.create(ingredients_validated_data)

        return recipe

    def update(self, instance, validated_data):
        ingredients_validated_data = validated_data.pop('ingredients', None)

        super().update(instance, validated_data)

        isPatch = self.partial
        if (isPatch and ingredients_validated_data) or (not isPatch):
            instance.ingredients.all().delete()

        if ingredients_validated_data:
            for ingredient in ingredients_validated_data:
                ingredient['recipe'] = instance
            ingredient_set_serializer = self.fields['ingredients']
            ingredient_set_serializer.create(ingredients_validated_data)

        return instance
