import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Trilha } from "./trilha-conhecimento.model"
import { ADDRESS_API } from '../app.api'
import { ApiResponse } from '../app.api'
import { TrilhaCategoria } from './categoria-trilha-conhecimento/categoria-trilha-conhecimento.model';
import { TrilhaSobre } from 'src/app/trilha-conhecimento/sobre-trilha-conhecimento/sobre-trilha-conhecimento.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class TrilhasService {

    constructor(private http: HttpClient) {
    }

    getTrilhas(idFaculdade): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias/` + idFaculdade);
    }

    getTrilhasCategoria(id?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/trilhas_card/` + id);
    }

    getTrilhasHome(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/trilhas_card`);
    }

    getCategoria(id?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categoria/` + id);
    }

    getCategoryIDBySlug(slug_categoria: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categoria/slug/` + slug_categoria);
    }

    getTrilhaIDBySlug(slug_trilha: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/trilha/slug/` + slug_trilha);
    }

    getConfiguracaoTrilha(id?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/configuracao/` + id + `/paginas`);
    }

    getFilteredTrilha(categoryId: string, cityId: string, order1: string, price: string, pageNumber: number, serchWord: string, categoria): Observable<ApiResponse> {
        let data = {
            id_categoria: categoryId,
            cidade: cityId,
            order1: order1,
            preco: price,
            search: serchWord,
            categoria: categoria
        }
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/trilha/search`, data, httpOptions);
    }

    

    getTrilhaSobre(id: string):Observable<TrilhaSobre>{
        return this.http.get<TrilhaSobre>(`${ADDRESS_API}/api/trilha_detalhes/` + id);
    }

    getFavorites(id): Observable<ApiResponse> {       
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/trilha-favoritos/${id}`);
    }

    recordAsFavorite(data, isFavorite): Observable<ApiResponse> {
        console.log('post',data,isFavorite);
        if(!isFavorite)
            return this.http.post<ApiResponse>(`${ADDRESS_API}/api/trilha-favoritar`, data);
        else
            return this.http.post<ApiResponse>(`${ADDRESS_API}/api/trilha-desfavoritar`, data);
    }

    getCategoriasComTrilhasCadastradas(faculdadeId):Observable<ApiResponse>{
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias/trilhas/${faculdadeId}`);
    }
}
