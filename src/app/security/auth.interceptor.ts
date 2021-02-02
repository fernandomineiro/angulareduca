import { Injectable, Injector } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import $ from 'jquery';

import { LoginService } from './login/login.service';
import { LoadingScreenService } from '../shared/loading-screen/loading-screen.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    activeRequests: number = 0;
    constructor(
        private injector: Injector,
        private loadingScreenService: LoadingScreenService
    ) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const loginService = this.injector.get(LoginService);

        this.showLoader();

        let authRequest = request.clone({
            setHeaders: {
                Faculdade: environment.faculdade_id.toString()
            }
        });

        if (loginService.isLoggedIn()) {
            authRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, Faculdade: environment.faculdade_id.toString()
                }
            });

            return next.handle(authRequest).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof  HttpResponse) {
                    this.hideLoader();
                }
            }, (err: any) => {
                this.hideLoader();

                if (err.ok === false && err.status === 401 && err.statusText === 'Unauthorized') {
                    loginService.logout();
                }
            }));
        }

        return next.handle(authRequest).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof  HttpResponse) {
                this.hideLoader();
            }
        }, (err: any) => {
            this.hideLoader();
        }));
    }

    showLoader() {
        if (this.activeRequests === 0) {
            this.loadingScreenService.startLoading();
        }

        this.activeRequests++;
    }

    hideLoader() {
        this.activeRequests--;
        if (this.activeRequests === 0) {
            this.loadingScreenService.stopLoading();
        }
    }
}


