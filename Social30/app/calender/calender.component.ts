import { Component, OnInit } from '@angular/core';
import {Page} from "ui/page";


@Component({
	moduleId: module.id,
	selector: 'calender',
	templateUrl: './calender.component.html',
	styleUrls: ['./calender.component.scss']
})

export class CalenderComponent implements OnInit {

	constructor(page: Page) {
        //page.actionBarHidden = true;
    }

	ngOnInit() { }
}