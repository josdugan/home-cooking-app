import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();
  
  private recipes: Recipe[] = [
    new Recipe('Schnitzel',
    'This is simply a test',
    './assets/images/crispy-lime-chicken.jpg',
    [
      new Ingredient('Meat', 1),
      new Ingredient('Fries', 20)
    ]),
    new Recipe('Burger',
    'This is simply another test',
    './assets/images/crispy-lime-chicken.jpg',
    [
      new Ingredient('Buns', 2),
      new Ingredient('Meat', 1),
    ])
  ];

  constructor(private shoppingListService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
