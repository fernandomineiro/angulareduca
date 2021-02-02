import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Assinatura } from "./assinatura.model"
import { ADDRESS_API } from '../app.api'
import { ApiResponse } from '../app.api'

@Injectable({
    providedIn: 'root'
})
export class AssinaturaService {

    constructor(private http: HttpClient) {
    }

    getAssinaturas(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/assinaturas`);
    }
    assinaturaById(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/assinatura/${id}`);
    }
}