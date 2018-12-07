import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

// routing
import { AppRoutingModule } from "./app-routing.module";

// depricated but for some reason used sometimes
// import { NSModuleFactoryLoader } from "nativescript-angular/router";

// component
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { RegisterComponent } from './register/register.component';

// services
import { ItemService } from "./shared/services/item.service";
import { AuthenticationService } from './shared/services/authentication.service';
import { AppSettingsService } from './shared/services/appsettings.service';
import { CalendarService } from './shared/services/calendar.service';
import { AlertService } from './shared/services/alert.service';
import { DataService } from './shared/services/data.service';
import { ChatService } from './shared/services/chat.service';
import { ProfileService } from './shared/services/profile.service';

// HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

// two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms';

// helper
import { TokenInterceptor } from './shared/helper/token.interceptor';
import { HTTP_INTERCEPTORS } from "@angular/common/http";


@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptHttpClientModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
    ],
    entryComponents: [],
    declarations: [
        AppComponent,
        LoginComponent,
        WelcomeComponent,
        RegisterComponent,
    ],
    providers: [
        ItemService,
        AuthenticationService,
        AppSettingsService,
        CalendarService,
        AlertService,
        DataService,
        ChatService,
        ProfileService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
