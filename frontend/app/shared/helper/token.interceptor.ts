import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppSettingsService } from '../services/appsettings.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private appSet: AppSettingsService) { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // first if in case user requests anything without token
        if(this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (currentUser && currentUser.token) {
                request = request.clone({
                    setHeaders: { 
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }
        return next.handle(request);
    }
}