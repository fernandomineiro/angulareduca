import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusAprovacao } from './status-aprovacao.model';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API } from 'src/app/app.api';

@Injectable({
  providedIn: 'root'
})
export class StatusAprovacaoService {

  constructor(private http: HttpClient) { }

  getCoursesStatus(idProfessor): Observable<any> {    
    // http://127.0.0.1:8000/api/status-aprovacao/1/1/lista
    return this.http.get(`${ADDRESS_API}/api/status-aprovacao/1/1/lista`);
   // return this.http.get<StatusAprovacao[]>("../assets/modelos json/status-aprovacao.json");    
  }

  getFixes(id: string): Observable<string[]> {
    return this.http.get<string[]>('../assets/modelos json/fixes.json');
  }
}
