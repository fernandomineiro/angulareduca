import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Evento } from "./eventos.model";

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';
import { MeusEventos } from './meus-eventos/meus-eventos.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {

    currentCategory = '-1';
    currentCity = '-1';
    currentOrder1 = 'asc';
    currentOrder2 = 'vendidos';
    currentPrice = '0';
    currentSearchWord = '';
    constructor(private http: HttpClient) {
        
    }

    getProximosEventos(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/evento`);
    }

    searchEventos(categoria, cidade, search, sort1, sort2): Observable<ApiResponse> {
        const data = {
            idCategoria: categoria,
            cidade,
            search,
            order1: sort1,
            order2: sort2
        }
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/evento/search`, data);
    }

    eventoById(id: number): Observable<ApiResponse> {
        console.log(id)
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/eventos/${id}`);
    }

    getMeusEventos(id): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/evento/${id}/meus-eventos`);
    }

    criarEvento(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/evento/create`, data);
    }
}