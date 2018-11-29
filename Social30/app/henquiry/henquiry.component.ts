import { Component, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute} from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
//import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
//import { HenquiryModalComponent } from "../henquiry-modal/henquiry.modal";
import { ItemService } from "../shared/services/item.service";



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

    categorySelected: boolean = false;
    categoryId;
    categorySubId;


    subNames: String[];


    setIcon = this.itemService.getCategoryIconName;

    public constructor(
        page: Page, 
        private itemService: ItemService,
        private route: ActivatedRoute,
		private router: Router,
		private routerExtension: RouterExtensions,) { 
            //page.actionBarHidden = true;
    }   


    ngOnInit(): void {}

	public goBack() {
        this.routerExtension.back();
    }

    switchStatus (id: number) {
        this.categorySelected = !this.categorySelected;
        this.categoryId = id;
        this.subNames = this.itemService.getSubElements(this.categoryId);
        console.log(this.subNames);
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }


    

}

// private modal: ModalDialogService, private vcRef: ViewContainerRef, 
