import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) { }

  getFaq(): Observable<any> {    
    return this.http.get<any>("../assets/modelos json/faq.json");    
  }
}
