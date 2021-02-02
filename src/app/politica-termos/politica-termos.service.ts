import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ADDRESS_API } from 'src/app/app.api';

@Injectable({
  providedIn: 'root'
})
export class PoliticaTermosService {

  constructor(private http: HttpClient) { }

  getPoliticas(id): Observable<any> {    
    return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${id}/politica`)   ;  
  }

  getTermos(id): Observable<any> {    
    return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${id}/termo`)   ;  
  }
}
