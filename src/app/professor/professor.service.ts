import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Professor } from './professor.model';

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

    constructor(private http: HttpClient) {
    }

    get(idFaculdade: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professores/${idFaculdade}`);
    }

    recentes(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professores/recentes`);
    }

    promocoes(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professores/promocoes`);
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/professor/${id}`);
    }

    getProfessorByIdUsuario(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/professor/${id}/usuario`);
    }

    getCursosByProfessorId(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/professor/${id}/cursos`);
    }

    getCursosByProfessorIdAndFaculdadeID(professorID: number, faculdadeID: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/professor/${professorID}/${faculdadeID}/cursos`);
    }

    getProfessoresByCategoriaId(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/categoria/${id}/professores`);
    }

    getTiposFormacao(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professor-tipos-formacao`);
    }

    getPropostaCategorias(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias`);
    }

    create(data): Observable<any> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/professor`, data);
    }

    saveMiniCurriculo(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/professor/salvar-minicurriculo`, data);
    }

    saveProfessor(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/professor/salvar`, data);
    }

    saveEndereco(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/professor/salvarEndereco`, data);
    }

    saveDadosBancarios(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/professor/salvar-dados-bancarios`, data);
    }

    searchProfessor(searchTerm): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professores-busca/${searchTerm}/search`);
    }

    getBancos() {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/banco`);
    }

    getRelatorios(month,year,ies): Observable<ApiResponse>{
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios-graficos/${month}/${year}/${ies}`);
    }

    exportarRelatorios(month,year,ies): Observable<ApiResponse>{
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios-graficos/${month}/${year}/${ies}/export`,{
            'responseType':'application/*' as 'json'
        });
    }

    getProfessoresByCategoriaId2(idFaculdade:number, idCategoria: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/professores/${idFaculdade}/${idCategoria}`);
    }
}

