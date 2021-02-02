import { Injectable } from '@angular/core';

// @ts-ignore
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API } from '../app.api';

// @ts-ignore
import $ from 'jquery';
// @ts-ignore
declare var $: $;

@Injectable({
    providedIn: 'root'
})
export class MeAviseModalService {

    constructor(private http: HttpClient) {
        // $.noConflict();
    }

    openWarning() {
        $('#meavise').modal('show');
    }

    salvarDadosDeAviso(data): Observable<any> {
        return this.http.post<any>(`${ADDRESS_API}/api/avisar-novas-turmas/create`, data);
    }
}
