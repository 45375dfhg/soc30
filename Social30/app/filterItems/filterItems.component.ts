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
	
	
	constructor(private router: RouterExtensions) { }

	ngOnInit() {

	 }


	 navigateAway(){
		this.router.navigate(['/items'], {
			transition: {
				name: 'curlDown',
				duration: 1000,
				curve: 'linear'
			}
		})
	}


	 getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}