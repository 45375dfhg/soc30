import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { ChatComponent } from "./chat.component";
import { ChatDetailComponent } from '../chat-detail/chat.detail.component';
import { RatingComponent } from "~/rating/rating.component";

// interceptor
// import { TokenInterceptor } from '../shared/helper/token.interceptor';
// import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "chat" },
            { path: "chat", component: ChatComponent },
            { path: "chats/:id", component: ChatDetailComponent},
            { path: "rating/:id", component: ChatDetailComponent}
        ])
    ],
    declarations: [
        ChatComponent,
        ChatDetailComponent,
        RatingComponent
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ChatModule { }