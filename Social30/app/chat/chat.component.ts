import { Component } from "@angular/core";
import { getCategoryIconSource } from "../app.component";

@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

    public constructor() {}




    getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}
}