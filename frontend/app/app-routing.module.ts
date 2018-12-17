import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', loadChildren: "./navigation/navigation.module#NavigationModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
