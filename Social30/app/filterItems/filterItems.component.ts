import { Component, OnInit } from '@angular/core';
import { getCategoryIconSource } from "../app.component";
import { RouterExtensions } from 'nativescript-angular/router';
import { Route } from '@angular/router';
import { isAndroid, isIOS, device, screen } from "platform";
import { View } from "ui/core/view";
import { ClientRequestArgs } from 'http';

@Component({
	moduleId: module.id,
	selector: 'filterItems',
	templateUrl: './filterItems.component.html',
	styleUrls: ['./filterItems.component.scss']

})



export class FilterItemsComponent implements OnInit {

	selected = null;

	constructor(private router: RouterExtensions) { }

	ngOnInit() {

	}


	changeColor(args) {

		let btn = args.object; // tapped on object

		if (btn.className === "orangeButton") { // tapped object is white
			if (this.selected === null) {
				btn.className = "orangeButtonSelected"; // change style
				this.selected = btn; // assign tapped button to selected
			} else {
				this.selected.className = "orangeButton";
				btn.className = "orangeButtonSelected";
				this.selected = btn;
			}
		} else {
			btn.className = "orangeButton"; // deselect
			this.selected = null;
		}

	}



	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

}
