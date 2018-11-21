import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";

@Component({
    moduleId: module.id,
    selector: "my-modal",
    templateUrl: './henquiry.modal.html',
})
export class HenquiryModalComponent {

    public frameworks: Array<string>;

    public constructor(private params: ModalDialogParams) {
        this.frameworks = [
            "NativeScript",
            "Xamarin",
            "Onsen UI",
            "Ionic Framework",
            "React Native"
        ];
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

}