import { Component } from "@angular/core";
import { getCategoryIconSource } from "../app.component";
import { Page } from "tns-core-modules/ui/page";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

    public constructor(private page: Page) {
        this.page.enableSwipeBackNavigation = false;
    }




    getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}
}