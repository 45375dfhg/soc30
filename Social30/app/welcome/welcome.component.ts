import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//import { Carousel, IndicatorAnimation } from 'nativescript-carousel';
import { getCategoryIconSource } from "../app.component";
import { Page } from "tns-core-modules/ui/page";


@Component({
	moduleId: module.id,
	selector: 'welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss']

})

export class WelcomeComponent implements OnInit {
	//@ViewChild('carousel') carouselRef: ElementRef;
	constructor(page: Page) {
		page.actionBarHidden = true;
	}

	ngOnInit() {

	}


	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

}