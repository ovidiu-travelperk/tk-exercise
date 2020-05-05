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

    def _handle_ingredients_data(self, validated_data, is_update=False):
        ingredients_validated_data = validated_data.pop('ingredients', None)

        def handle_ingredients(recipe):
            isPatch = self.partial
            if is_update:
                if(isPatch and ingredients_validated_data) or (not isPatch):
                    recipe.ingredients.all().delete()

            if ingredients_validated_data:
                for ingredient in ingredients_validated_data:
                    ingredient['recipe'] = recipe

                ingredient_set_serializer = self.fields['ingredients']
                ingredient_set_serializer.create(ingredients_validated_data)

        return handle_ingredients

    def create(self, validated_data):
        handle_ingredients = self._handle_ingredients_data(validated_data)

        recipe = super().create(validated_data)

        handle_ingredients(recipe)

        return recipe

    def update(self, instance, validated_data):
        handle_ingredients = self._handle_ingredients_data(
            validated_data, is_update=True)

        super().update(instance, validated_data)

        handle_ingredients(instance)

        return instance
