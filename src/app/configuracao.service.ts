import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { BehaviorSubject, Observable} from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { ADDRESS_API } from './app.api';

import { NotificationService } from './shared/messages/notification.service';

import { environment } from '../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class ConfiguracaoService {

    constructor(private http: HttpClient) { }

    getConfiguracoesFaculdade(idFaculdade): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${idFaculdade}`);
    }

}
