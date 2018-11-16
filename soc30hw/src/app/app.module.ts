import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

// used to create fake backend
import { fakeBackendProvider } from './shared/helper/fake-backend'

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item-detail/item-detail.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { CalenderComponent } from "./calender/calender.component";

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
        ItemsComponent,
        ItemDetailComponent,
        NavigationComponent,
        CalenderComponent,
    ],
    providers: [
        ItemService,
        
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
