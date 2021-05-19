import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as fromApp from '../../store/app.reducer';
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipe.actions';

@Injectable()
export class RecipeEffects {

    apiUrl: string = environment.recipeBookApiUrl;
    recipesEndpoint: string = '/recipes.json';

    @Effect() fetchrecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(`${this.apiUrl}${this.recipesEndpoint}`);
        }),
        map(recipes => {
            return recipes.map(recipe => {
              return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
            });
          }
        ),
        map(recipes => new RecipesActions.SetRecipes(recipes))
    );

    @Effect({dispatch: false}) storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put(`${this.apiUrl}${this.recipesEndpoint}`, recipesState.recipes);
        })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) { }
}