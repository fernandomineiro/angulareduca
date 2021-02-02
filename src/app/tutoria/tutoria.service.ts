import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TutoriaTrabalho } from 'src/app/tutoria/tutoria-trabalhos/tutoria-trabalho.model';
import { Observable } from 'rxjs';
import { TutoriaMensagens } from 'src/app/tutoria/tutoria-mensagens/tutoria-mensagens.model';
import { TutoriaChat } from 'src/app/tutoria/tutoria-chat/tutoria-chat.model';
import { ADDRESS_API, ApiResponse } from 'src/app/app.api';
import { HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class TutoriaService {

  constructor(private http: HttpClient) { }

  getTrabalhos(): Observable<TutoriaTrabalho[]> {
    return this.http.get<TutoriaTrabalho[]>(`${ADDRESS_API}/api/tutoria/trabalhos`);
  }

  get(request: object): Observable<ApiResponse> {
    let params = new HttpParams();

    Object.keys(request).forEach(key => {
        params = params.set(key, request[key]);
    });

    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/tutoria/trabalhos`, { params });
  }

  getMensagens(data): Observable<any> {
    return this.http.post<any>(`${ADDRESS_API}/api/tutoria/mensagens`, data);
  }

  getChat(id: string): Observable<any> {
    return this.http.get<any>(`${ADDRESS_API}/api/tutoria/chat/` + id);
  }

  postMensagem(data): Observable<any> {
    return this.http.post<any>(`${ADDRESS_API}/api/resposta`, data, httpOptions);
  }

  postTrabalho(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ADDRESS_API}/api/tutoria/trabalhos/save`, data, httpOptions);
  }

  getUsuarioTrabalhos(id: string): Observable<ApiResponse> {
      return this.http.get<ApiResponse>(`${ADDRESS_API}/api/tutoria/usuario-trabalhos/` + id);
  }
}
