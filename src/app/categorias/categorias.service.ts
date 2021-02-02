import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Categoria } from "../categorias/categorias.model"

import { ApiResponse } from '../app.api'
import { ADDRESS_API } from '../app.api'

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

    constructor(private http: HttpClient) {
    }

    get(idFaculdade): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias/` + idFaculdade);
    }

    getCategoria(id?:string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categoria/` + id);
        // return this.http.get<TrilhaCategoria[]>("../assets/modelos json/trilha-lista.json");
    }
    
    getCategorias(idFaculdade): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias/` + idFaculdade);
    }

    getIDCategoriaBySlug(slug_categoria: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categoria/slug/` + slug_categoria);
    }

    getCursosCategoriaETipo(idCategoria, tipo, dados): Observable<ApiResponse> {
        const parametros = {...dados, categoria_id: parseInt(idCategoria), fk_faculdade: environment.faculdade_id}
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/${tipo}`, parametros);
    }

}
