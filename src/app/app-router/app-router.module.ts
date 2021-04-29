import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipeDetailsComponent } from '../recipes/recipe-details/recipe-details.component';
import { RecipeStartComponent } from '../recipes/recipe-start/recipe-start.component';

const appRoutes : Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: RecipeStartComponent },
    { path: ':id', component: RecipeDetailsComponent}
  ]
}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouterModule { }
