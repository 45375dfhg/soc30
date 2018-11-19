import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
// import { NSModuleFactoryLoader } from "nativescript-angular/router";

// Component
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";

// Services
import { ItemService } from "./shared/services/item.service";
import { AuthenticationService } from './shared/services/authentication.service';

// HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

// two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [
        ItemService,
        AuthenticationService,
        // { provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader }
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
