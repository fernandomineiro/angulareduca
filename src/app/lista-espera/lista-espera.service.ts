import { Injectable } from '@angular/core';

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class ListaEsperaService {

    constructor(private http: HttpClient) { }

    getListasEspera(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/lista-espera`);
    }

    avisaInteressados(data: any): Observable<any> {
        return this.http.post<any>(`${ADDRESS_API}/api/avisar-interessados`, data);
    }

}
