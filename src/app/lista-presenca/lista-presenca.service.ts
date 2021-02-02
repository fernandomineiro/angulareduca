import { Injectable } from '@angular/core';

import { ApiResponse } from '../app.api';
import { ADDRESS_API } from '../app.api';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ListaPresenca } from 'src/app/lista-presenca/lista-presenca.model';
import { ListaPresencaTurma } from 'src/app/lista-presenca/lista-presenca-turma.model';
import { Observable } from 'rxjs';
import { ListaPresencaStudents } from 'src/app/lista-presenca/lista-presenca-students.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ListaPresencaService {

  constructor(private http: HttpClient) { }

  getListasPresenca(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/lista-presenca`);
  }

  getListaStudents(courseId: string, dayId: string): Observable<ListaPresencaStudents[]> {
    return this.http.get<ListaPresencaStudents[]>(`${ADDRESS_API}/api/lista-presenca-students/` + courseId + '/' + dayId);
  }

  sendListaPresenca(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ADDRESS_API}/api/lista-presenca`, data, httpOptions);
  }
}
