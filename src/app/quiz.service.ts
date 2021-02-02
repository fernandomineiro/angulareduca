import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiResponse } from './app.api';
import { ADDRESS_API } from './app.api';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    }) 
};

@Injectable({
  providedIn: 'root'
})
export class QuizService {

    // quizForm: FormGroup;
    // private formBuilder: FormBuilder
    constructor(private http: HttpClient) {
    }

    getByIds(idCurso: number, idQuiz: number, idUsuario): Observable<any> {
        return this.http.get(`${ADDRESS_API}/api/quiz-por-curso/${idCurso}/${idQuiz}/${idUsuario}`);
    }
 

    enviar(data): Observable<ApiResponse> { 
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/quiz-por-curso/enviar`, data, httpOptions);
    }

    getQuizSituacao(idCurso,idQuiz,idUsuario): Observable<any>{
        return this.http.get(`${ADDRESS_API}/api/quiz-por-curso/situacao/${idCurso}/${idQuiz}/${idUsuario}`);
    }

    verGabarito(data): Observable<any> { 
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/quiz-por-curso/gabarito`, data, httpOptions);
    }
    
}
