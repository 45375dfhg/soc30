import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { ModalDialogService } from "nativescript-angular/modal-dialog";

// routing
import { AppRoutingModule } from "./app-routing.module";

// depricated but for some reason used sometimes
// import { NSModuleFactoryLoader } from "nativescript-angular/router";

// component
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
// import { HenquiryModalComponent } from './henquiry-modal/henquiry.modal';

// services
import { ItemService } from "./shared/services/item.service";
import { AuthenticationService } from './shared/services/authentication.service';
import { AppSettingsService } from './shared/services/appsettings.service';

// HttpClient wrapper
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

// two-way binding
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { ReactiveFormsModule } from '@angular/forms';

// helper
import { TokenInterceptor } from './shared/helper/token.interceptor';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// import { fromEventPattern } from "rxjs";

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
    entryComponents: [
        // HenquiryModalComponent
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        // HenquiryModalComponent
    ],
    providers: [
        ItemService,
        AuthenticationService,
        AppSettingsService,
        ModalDialogService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
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
