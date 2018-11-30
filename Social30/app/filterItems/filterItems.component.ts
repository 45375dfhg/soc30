import { Component, OnInit } from '@angular/core';
import { getCategoryIconSource } from "../app.component";
import { RouterExtensions } from 'nativescript-angular/router';
import { Route } from '@angular/router';
import { isAndroid, isIOS, device, screen } from "platform";
import { View } from "ui/core/view";
import { ClientRequestArgs } from 'http';

import { DataService } from '../shared/services/data.service';

@Component({
	moduleId: module.id,
	selector: 'filterItems',
	templateUrl: './filterItems.component.html',
	styleUrls: ['./filterItems.component.scss']

})

export class FilterItemsComponent implements OnInit {

	private selected = null;
	message: { categories: boolean[] , time: number ,distance: number };

	constructor(private router: RouterExtensions, private data: DataService,) { }

	ngOnInit() { 
		this.data.currentMessage.subscribe(message => {
			this.message = message
		})
	}

	newMessage(c, t, d) {
		this.data.changeMessage(c,t,d);
	}

	handleTap(args, c = this.message.categories, t = this.message.time, d = this.message.distance) {
		this.changeColor(args);
		console.log(c,t,d);
		this.newMessage(c,t,d);
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
