import { Injectable } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { alert, prompt } from "tns-core-modules/ui/dialogs";

@Injectable()
export class AlertService {

    // this is nothing but a HttpErrorResponse to alert message converter
    // why not modals? modals are fullscreen on iOS so yeah no.

    private errorList = {
        400: "Diese E-Mail wird bereits für einen bestehenden Account verwendet. Bist du vielleicht bereits registriert?",
        401: "Es ist etwas bei der Anmeldung schiefgelaufen - waren deine Daten korrekt?"
    }

    constructor() {}
    
    catchAndSelect(err: Error) {
        if (err instanceof HttpErrorResponse) {
            this.displaySelectedErrors(err.status);
        } else {
            console.log(err);
        }
    }

    displaySelectedErrors(status: number) {
        if (this.errorList[status]) {
            alert({
                title: "Es ist etwas schiefgelaufen ...",
                message: this.errorList[status],
                okButtonText: "OK"
            }).then(() => {
                console.log("Dialog closed!");
            });
        }
    }


}