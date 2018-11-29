import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    
    private messageSource = new BehaviorSubject({
        categories: [0,1,2,3,4,5],
        time: 30,
        distance: 6,
    });
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    changeMessage(c, t, d) {
        this.messageSource.next({ 
            categories: c,
            time: t,
            distance: d
        })
    }
}