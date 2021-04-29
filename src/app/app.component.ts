import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() shownComponent: string = 'recipes';

  constructor() {

  }

  onShowComponentEvent(componentToShow) {
    console.log(componentToShow);
    this.shownComponent = componentToShow;
  }
}
