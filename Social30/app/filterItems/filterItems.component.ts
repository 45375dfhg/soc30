import { Component, OnInit } from '@angular/core';
import { getCategoryIconSource } from "../app.component";
import { RouterExtensions } from 'nativescript-angular/router';
import { Route } from '@angular/router';


@Component({
	moduleId: module.id,
	selector: 'filterItems',
	templateUrl: './filterItems.component.html',
	styleUrls: ['./filterItems.component.scss']

})



export class FilterItemsComponent implements OnInit {
	
	
	constructor(private router: RouterExtensions ) { }

	ngOnInit() {

	 }


	 changeColor(args) {
		var btn = args.object;
		

		if(btn.className === "orangeButton"){
			btn.className = "orangeButtonSelected";
		}else{
			btn.className = "orangeButton";
		}
		
	 }


	 getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}
