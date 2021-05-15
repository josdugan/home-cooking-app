import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "../alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        DropdownDirective,
        LoadingSpinnerComponent,
        AlertComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DropdownDirective,
        LoadingSpinnerComponent,
        AlertComponent
    ]
})
export class SharedModule { }