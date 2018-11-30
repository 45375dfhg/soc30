import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    
    private messageSource = new BehaviorSubject({
        categories: [true,true,true,true,true,true],
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