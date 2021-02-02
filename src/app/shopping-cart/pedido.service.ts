import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Pedido } from "../pedido/pedido.model"

import { ApiResponse } from '../app.api'
import { ADDRESS_API } from '../app.api'

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

    constructor(private http: HttpClient) { }

    getById(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/pedido/${id}`);
    } 
    
    getPedidosByAlunoId(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/pedido/${id}/aluno`);
    }
    
    create(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/pedido/create`, data, httpOptions);
    }    
    
}

