import { Component, OnInit } from '@angular/core';
import { getCategoryIconSource } from "../app.component";
import { RouterExtensions } from 'nativescript-angular/router';
// import { Route } from '@angular/router';
// import { isAndroid, isIOS, device, screen } from "platform";
// import { View } from "ui/core/view";
// import { ClientRequestArgs } from 'http';
import { Page } from "tns-core-modules/ui/page";
import { DataService } from '../shared/services/data.service';

@Component({
	moduleId: module.id,
	selector: 'filterItems',
	templateUrl: './filterItems.component.html',
	styleUrls: ['./filterItems.component.scss']

})

export class FilterItemsComponent implements OnInit {

	private selectedTime = null;
	private selectedAmount = null;
	message: { categories: boolean[] , time: number ,distance: number };

	constructor(private router: RouterExtensions, private data: DataService, private page: Page) { 
		this.page.enableSwipeBackNavigation = false;
	}

	ngOnInit() { 
		this.data.currentMessage.subscribe(message => {
			this.message = message
		})
		this.reset();
	}

	newMessage(b, old, c, t, d) {
		this.data.changeMessage(b, old,c,t,d);
	}

	handleTapCategory(args, b, old = this.message.categories, c = this.message.categories, t = this.message.time, d = this.message.distance) {
		this.changeColorCategory(args);
		this.newMessage(b, old, c,t,d);
	}

	handleTapTime(args, b, old = this.message.categories, c = this.message.categories, t = this.message.time, d = this.message.distance) {
		this.changeColorTime(args);
		this.newMessage(b, old, c,t,d);
	}

	handleTapAmount(args, b, old = this.message.categories, c = this.message.categories, t = this.message.time, d = this.message.distance) {
		this.changeColorAmount(args);
		this.newMessage(b, old, c,t,d);
	}

	reset() {
		this.newMessage(false, [true,true,true,true,true],[true,true,true,true,true],210,60);
	}

	changeColorCategory(args) {
		let btn = args.object; // tapped on object
		if (btn.className === "orangeButtonCategorySelected") {
			btn.className = "orangeButtonCategory";
		} else {
			btn.className = "orangeButtonCategorySelected";
		}
	}
	
	changeColorTime(args) {
		let btn = args.object; // tapped on object
		if (btn.className === "orangeButtonTime") { // tapped object is white
			if (this.selectedTime === null) {
				btn.className = "orangeButtonTimeSelected"; // change style
				this.selectedTime = btn; // assign tapped button to selected
			} else {
				this.selectedTime.className = "orangeButtonTime";
				btn.className = "orangeButtonTimeSelected";
				this.selectedTime = btn;
			}
		} else {
			btn.className = "orangeButtonTime"; // deselect
			this.selectedTime = null;
		}
	}

	changeColorAmount(args) {
		let btn = args.object; // tapped on object
		if (btn.className === "orangeButtonAmount") { // tapped object is white
			if (this.selectedAmount === null) {
				btn.className = "orangeButtonAmountSelected"; // change style
				this.selectedAmount = btn; // assign tapped button to selected
			} else {
				this.selectedAmount.className = "orangeButtonAmount";
				btn.className = "orangeButtonAmountSelected";
				this.selectedAmount = btn;
			}
		} else {
			btn.className = "orangeButtonAmount"; // deselect
			this.selectedAmount = null;
		}
	}

	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

}
