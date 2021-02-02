import { Injectable } from '@angular/core';
import { Subject , Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Aluno } from './aluno.model';

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';
import { SidebarInfo } from './cursando/sidebar-info/sidebar-info.model';
import { TutoriaMensagens } from '../tutoria/tutoria-mensagens/tutoria-mensagens.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    }) 
};

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
    uploadForm: FormGroup;

    constructor(private http: HttpClient, private formBuilder: FormBuilder) {
        
    }

    get(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/aluno`);
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/aluno/${id}`);
    }

    getCursosByAlunoId(id: number): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/aluno/${id}/cursos`);
    }

    create(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/aluno/create`, data, httpOptions);
    }

    update(data, id): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/aluno/${id}/update`, data, httpOptions);
    }

    updateEndereco(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/aluno/saveEndereco`, data, httpOptions);
    }

    updateCredentials(data, id): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/aluno/${id}/saveCredentials`, data, httpOptions);
    }

    fotoUpload(f: File, id): Observable<ApiResponse> {
        // let formData = new FormData();
        // formData.append('imagem', f);
        // let jsonObject= {};

        // for(const [key,value] of formData.getAll(name)) {
        //     jsonObject[key] = value;
        // }
        this.uploadForm = this.formBuilder.group({
            imagem: ['']
        });

        this.uploadForm.get('imagem').setValue(f);

        const formData = new FormData();
        formData.append('imagem', this.uploadForm.get('imagem').value);


        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/aluno/${id}/upload_foto`, formData);
    }

    getSidebarInfo(idCurso: number, id?: number): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/curso-side-bar/${idCurso}/${id}`); 
    }

    getDuvidas(id: number, idCurso: number): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/curso-duvidas-externo/${id}/${idCurso}`);
      }

    getCertificadosDisponiveis(id: number): Observable<any>{
        //return this.http.get<any>('../assets/modelos json/certificados-disponiveis.json'); 
        return this.http.get<any>(`${ADDRESS_API}/api/certificado/getCertificadosAluno/${id}`);
        
    }

    getCertificado(id: number, idCurso: number): Observable<any>{
        //return this.http.get<any>('../assets/modelos json/certificados-disponiveis.json'); 
        return this.http.get<any>(`${ADDRESS_API}/api/certificado/getCertificadoAluno/${id}/${idCurso}`);        
    }

    sendCertificadoEmail(data): Observable<any>{
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/certificado/envia-certificado-email`, data, httpOptions);
    }

    emiteCertificado(id: number, idCurso: number): Observable<any>{        
        return this.http.get<any>(`${ADDRESS_API}/api/certificado/emiteCertificado/${id}/${idCurso}`);        
    }

    getProgressoConclusao(id: number, idCurso: number): Observable<any>{
        return this.http.get<any>(`${ADDRESS_API}/api/certificado/getProgressoConclusao/${id}/${idCurso}`);
    }

    getTrabalhosEnviados(id: number, idCurso: number): Observable<any>{
        return this.http.get<any>(`${ADDRESS_API}/api/tutoria/usuario-trabalhos-cursos/${id}/${idCurso}`);
    }

    getFavorites(id: number): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/cursos-favoritos/${id}`);
    }

    getModulosCompletos(idUsuario:number,idCurso:number):Observable<any>{
        return this.http.get<any>(`${ADDRESS_API}/api/modulos-assistidos/${idCurso}/${idUsuario}`);
    }

    setModuleComplete(data): Observable<any>{
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/set-modulo-assistido`, data, httpOptions);
    }

    getEstados(): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/estados`);
    }

    getCidades(idEstado): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/cidades/${idEstado}`);
    }

    getCidadesByLocalidade(data): Observable<any> {
        return this.http.post<any>(`${ADDRESS_API}/api/cidades-por-localidade`, data );
    }

    getEnderecoCep(cep): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/aluno/buscar-cep/${cep}`);
    }  
    public tempo_finalizar: Subject<any> = new Subject<any>();
}

