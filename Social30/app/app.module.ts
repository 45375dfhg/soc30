import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { NSModuleFactoryLoader } from "nativescript-angular/router";
// used to create fake backend
import { fakeBackendProvider } from './shared/helper/fake-backend'

import { LoginComponent } from "./login/login.component";
//import { ItemsComponent } from "./item/items.component";
// import { ItemDetailComponent } from "./item-detail/item-detail.component";
// import { NavigationComponent } from "./navigation/navigation.component";
// import { CalenderComponent } from "./calender/calender.component";

import { ItemService } from "./shared/services/item.service";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule
    ],
    declarations: [
        AppComponent,
        //ItemsComponent,
        //ItemDetailComponent,
        //CalenderComponent,
        LoginComponent,
    ],
    providers: [
        ItemService,
        { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
        
        // provider used to create fake backend
        //fakeBackendProvider
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
