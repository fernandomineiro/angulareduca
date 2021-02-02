import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {catchError, tap, map, share} from 'rxjs/operators';

import { Curso } from './curso.model';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';

import * as underscore from 'underscore';
import { LoginService } from 'src/app/security/login/login.service';

import { environment } from 'src/environments/environment';
import {Store} from '@ngrx/store';
import {AppState} from '../index.reducers';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    }) 
};

@Injectable({
  providedIn: 'root'
})
export class CursosService {
    uploadForm: FormGroup;


    constructor(
        private http: HttpClient, private formBuilder: FormBuilder,  private loginService: LoginService,
        private store: Store<AppState>
    ) {
        
    }

    getTodosCursosPorTipo(tipo?): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/${tipo}`, {});
    }

    getCursosOnlinePorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-online-do-aluno/${idAluno}`);
    }

    getCourseIDBySlug(slug_curso: string, tipo_curso_id: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos/slug/${slug_curso}/${tipo_curso_id}`);
    }


    getCursosOnlineIniciadosPorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-online-iniciados-do-aluno/${idAluno}`);
    }

    getCursosPresenciaisPorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-presenciais-do-aluno/${idAluno}`);
    }

    getCursosRemotosPorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-remotos-do-aluno/${idAluno}`);
    }

    getMinhasEstatisticas(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/aluno-estatisticas/${idAluno}`);
    }

    getCursosOnlinePorProfessor(idProfessor?: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-online-professor/${idProfessor}`);
    }

    getCursosHidridosPorProfessor(idProfessor?: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-hidridos-professor/${idProfessor}`);
    }

    getCursosPresenciaisPorProfessor(idProfessor?: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-presenciais-professor/${idProfessor}`);
    }

    getCursosRecentes(tipo?: number): Observable<ApiResponse> {
        if (!tipo) { tipo = 0; }
        const data = {
            fk_faculdade: environment.faculdade_id,
            sort: 'latest'
        }
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/${tipo}`, data).pipe(share());
    }

    getCursosEmPromocao(tipo?: number): Observable<ApiResponse> {
        if (!tipo) { tipo = 0; }
        const data = {
            fk_faculdade: environment.faculdade_id,
            sort: 'promotions'
        }
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/${tipo}`, data);
    }

    getCursosMaisVendidos(tipo?: number): Observable<ApiResponse> {
        if (!tipo) { tipo = 0; }
        const data = {
            fk_faculdade: environment.faculdade_id,
            sort: 'best-seller'
        }
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/${tipo}`, data);
    }

    cursoById(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/${id}/0/0/${environment.faculdade_id}`);
    }

    tagsByCursoId(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/tags_por_curso/${id}`);
    }

    modulosByCursoId(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/modulos_por_curso/${id}`);
    }

    agendasByCursoId(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/agendas_por_curso/${id}`);
    }

    getHourFromServer(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/get-hour-from-server`);
    }

    comentariosByCursoId(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/comentarios_por_curso/${id}`);
    }

    createSugestao(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso-sugestao`, data);
    }

    getModuloById(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/modulo/${id}`);
    }

    getFavorites(id): Observable<ApiResponse> {       
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-favoritos/${id}`);
    }

    checkIfCourseIsFavorite(course, id, favorites) {
        if (!favorites || !course || !id || !this.loginService.isLoggedIn()) return false
        if (underscore.findWhere(favorites.items, {id: course}) !== undefined) {
            return of(true);
        }
        return of(false);
    }

    checkIfCourseWasBought(course, id, courses) {

        if (!this.loginService.isLoggedIn()) {
            return of(false);
        }

        if (underscore.findWhere(courses, {id: course}) != undefined) {
            return of(true);
        }

        return of(false);
    }

    recordAsFavorite(data, isFavorite): Observable<ApiResponse> {
        console.log('post');
        if(!isFavorite)
            return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso-favoritar`, data);
        else
            return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso-desfavoritar`, data);

    }

    getCursos(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search`, data);
    }

    uploadTcc(tccFile: File, cursoId: string, idUsuario?: string): Observable<ApiResponse> {

        this.uploadForm = this.formBuilder.group({ 
            tcc: [''] 
        });

        this.uploadForm.get('tcc').setValue(tccFile);

        const formData = new FormData();
        formData.append('tcc', this.uploadForm.get('tcc').value);

        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/tutoria/upload-tcc/${cursoId}/${idUsuario}`, formData);
    }

    cursosPorFaculdade(idFaculdade): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/faculdade/${idFaculdade}/cursos`);
    }

    getTrilhasPresenciaisPorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-trilha-presenciais-do-aluno/${idAluno}`);
    }

    getTrilhasRemotosPorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-trilha-remotos-do-aluno/${idAluno}`);
    }

    getTrilhasOnlinePorAluno(idAluno?: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-trilha-online-do-aluno/${idAluno}`);
    }

    getAssinaturas(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/assinaturas/minha-assinatura`);
    }

    getEventosAluno(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/eventos-do-aluno/${id}`);
    }

    adicionaModulosPorCurso(idCurso, data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/progressoCurso/${idCurso}/adicionaModulosPorCurso`, data);
    }

    checkIfCourseHasWaitingPayments(idCurso, idUsuario): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos/${idCurso}/${idUsuario}/verificar-pagamento`);
    }

    getMaxValueCourse(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/max-value-course`);
    }

    getCursosITV(idUsuario) {
        return this.http.get(`${ADDRESS_API}/api/cursos/${idUsuario}/get-cursos-itv`);
    }

    getCursosLayout2Home(filtro?): Observable<ApiResponse> {
        filtro = filtro ? '/'+filtro : '';
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos/listar-cursos-home${filtro}`);
    }

    getCursosLayout3Home(tipo, amountCourses, page): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos/listar-cursos-paginados/${tipo}/${amountCourses}?page=${page}`);
    } 

    getCursoMentoria(idCurso,userId?):Observable<any> {
        if(userId)
            return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso-ver/${idCurso}`, {params: {usuario_id: userId}});
        else if (JSON.parse(localStorage.getItem('user')).fk_perfil == 1 || JSON.parse(localStorage.getItem('user')).fk_perfil == 22 )
            return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso-ver/${idCurso}`);
    }

    getCursosMentoriaSearch(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/search/5`, data);
    }

    getCategoriasMentoria(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria`);
    }
    getAllCoursesGroupedByCategoria(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria?with=mentorias.professor`);
    }
    getAllCoursesGroupedByCategoriaOpen(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/mentoria/categorias?with=mentorias.professor`);
    }
    searchCoursesGroupedByCategoriaOpen(searchWord): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/mentoria/categorias?include[]=mentorias&search=${searchWord}`);
    }
    sortCoursesMentoria(type): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/mentoria/?sort=${type}`);
    }
    getAllCoursesByOneCategoria(idCategoria): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria/${idCategoria}?with=mentorias`);
    }
    postCategoriaMentoria(data): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria`, data);
    }
    putCategoriaMentoria(data, id): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria/${id}`, data);
    }
    deleteCategoriaMentoria(id): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${ADDRESS_API}/api/categorias-mentoria/${id}`);
    }
    getCategoriasMentoriaAberta(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/mentoria/categorias`);
    }
    getCourseMentoriaBySlug(slug): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/mentoria/${slug}?include[]=categorias&with=professor;professor.usuario`);
    }

    getCursoDetalhesEstruturaCurricular(idCurso, idEstrutura, idCategoria, idUsuario) {
        return this.http.get(`${ADDRESS_API}/api/cursos/detalhes-estrutura-curricular/${idCurso}/${idEstrutura}/${idCategoria}/${idUsuario}`);
    }
}
