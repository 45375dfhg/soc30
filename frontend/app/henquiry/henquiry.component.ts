import { Component } from "@angular/core";
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

    // imported this way to avoid angular namespace problems
    // cant use imported service functions inside html
    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;
    formatCategoryByUser = this.itemService.formatCategoryByUser;
    formatTerra = this.itemService.formatTerra;
    formatTime = this.itemService.formatTime;
    formatLocation = this.itemService.formatLocation;
    getSubStrings = this.itemService.getSubStrings;
    getSubs = this.itemService.getSubs;
    setIcon = this.itemService.getCategoryIconName;

    public constructor(
        private page: Page, 
        private itemService: ItemService,
        private route: ActivatedRoute,
		private router: Router,
		private routerExtension: RouterExtensions,) {
            this.page.enableSwipeBackNavigation = false;
        }   

    ngOnInit(): void {}

	public goBack() {
        this.routerExtension.back();
    }

    // used to flip between the two html structures while saving category id
    // which is used for routing to details where its used to create an henquiry
    switchStatus (id: number) {
        this.categorySelected = !this.categorySelected;
        this.categoryId = id;
        this.subNames = this.itemService.getSubElements(this.categoryId);
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}

