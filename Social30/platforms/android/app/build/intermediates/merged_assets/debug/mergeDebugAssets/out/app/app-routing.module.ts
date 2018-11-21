import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
/*
import { NavigationComponent } from "./navigation/navigation.component";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item-detail/item-detail.component";
import { CalenderComponent } from "./calender/calender.component";
*/

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', loadChildren: "./navigation/navigation.module#NavigationModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

/*
        // { path: '', redirectTo: '/navigation/(itemsoutlet:items//calenderoutlet:calender)', pathMatch: 'full' },
    /*
    [
        { path: 'items', component: ItemsComponent, outlet: 'itemsoutlet'},
        { path: 'items/:id', component: ItemDetailComponent, outlet: 'itemsoutlet'},
        { path: 'calender', component: CalenderComponent, outlet: 'calenderoutlet'},
      ]}
    */
    // { path: "", redirectTo: "/items", pathMatch: "full" }, 
    // { path: "items", component: ItemsComponent },
    // { path: "item/:id", component: ItemDetailComponent },