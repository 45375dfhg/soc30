import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
import { HenquiryModalComponent } from "../henquiry-modal/henquiry.modal";

@Component({
    moduleId: module.id,
    selector: "henq",
    templateUrl: './henquiry.component.html',
    styleUrls: ['./henquiry.component.scss']
})
export class HenquiryComponent {
    
    leicht: string = "Aufräumen, putzen, Plätzchen backen. Es sind die kleinen Dinge die Freude machen.";
    schwer: string = "Bisschen Knöf, bisschen was in den Armen - jemand zum Anpacken wird gesucht!";
    garten: string = "Der Rasen ist schief, das Laub außer Kontrolle und der Maulwurf ein echter Vandalle.";
    gesell: string = "In Ruhe bei Kaffee eine Runde Kartenspielen oder ausgelassen die Bingoparty sprengen.";
    tiere: string = "Ob Wuff, Miau oder Muh - gesucht ist ein Nachbar, der tierisch was drauf hat!";

    public constructor(page: Page) { 
        //page.actionBarHidden = true;
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}

// private modal: ModalDialogService, private vcRef: ViewContainerRef, 
