import { Injectable } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { alert } from "tns-core-modules/ui/dialogs";

@Injectable()
export class AlertService {

    // this is nothing but a HttpErrorResponse to alert message converter
    // why not modals? modals are fullscreen on iOS so yeah no.

    private errorList = {
        "AE_009": "Du hast zu dieser Zeit bereits etwas vor.",
        "AE_007": "Du hast bereits fünf Bewerbungen für diesen Tag.",
        "CC_003": "E-Mail bereits in Verwendung.",
        "CC_004": "Du hast nicht alles ausgefüllt.",
        "CC_005": "Deine E-Mail ist leider nicht gültig.",
        "CD_002": "Der Benutzer existiert nicht.",
        "CD_003": "Du hast nicht alles ausgefüllt"
    }

    constructor() {}
    
    catchAndSelect(err: Error) {
        if (err instanceof HttpErrorResponse) {
            console.log(err);
            this.displaySelectedErrors(err.error);
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