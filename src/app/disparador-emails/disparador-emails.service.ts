import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisparadorEmails } from 'src/app/disparador-emails/disparador-emails.model';
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
export class DisparadorEmailsService {

  constructor(private http: HttpClient) { }

  getLista(): Observable<DisparadorEmails[]> {
    return this.http.get<DisparadorEmails[]>('../assets/modelos json/disparador-email.json');
  }

  sendEmail(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ADDRESS_API}/api/disparador-email`, data, httpOptions);
  }
}
