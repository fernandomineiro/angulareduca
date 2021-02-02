import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agenda } from './agenda.model';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API, ApiResponse } from 'src/app/app.api';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  getAgenda(month): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${ADDRESS_API}/api/agenda-cursos/` + month);
  }
}
