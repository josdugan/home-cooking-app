import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  ingredientsChanged = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice();
  }
  
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.notifyIngredientsChanged();
  }
  
  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.notifyIngredientsChanged();
  }

  private notifyIngredientsChanged() {
    this.ingredientsChanged.emit(this.getIngredients());
  }
}