import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    
    private messageSource = new BehaviorSubject({
        categories: [true,true,true,true,true],
        time: 180,
        distance: 10,
    });
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    changeMessage(changeCategory, old, c, t, d) {
        // zips the old and c arrays and applies xor on their booleans
        // (which flattens the [][] -> [])
        let toggledCategories = [];
        if (changeCategory) {
            toggledCategories = c.map((x, idx) => [x, old[idx]])
            .map(arr => {
                return (arr[0] ? !arr[1] : arr[1]);
            })
        } else {
            toggledCategories = old;
        }
        this.messageSource.next({ 
            categories: toggledCategories,
            time: t,
            distance: d
        })
    }
}
