import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from "@angular/router"

import { Observable } from 'rxjs'
import { tap, filter } from 'rxjs/operators'

import { ADDRESS_API } from "../../app.api";
import { ApiResponse } from '../../app.api';
import { User } from '../../security/login/user.model'

import { Payment } from './payment.model'
import { pipe } from "@angular/core/src/render3/pipe";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
    })
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

    constructor(private http: HttpClient, private router: Router) {
    }
    
    
    processar(data): Observable<any> {
        console.log("data",data);
        return this.http.post<any>(`${ADDRESS_API}/api/wirecard/pay`, data, httpOptions);
    }

    assinar(data): Observable<any> {
        console.log("data",data);
        return this.http.post<any>(`${ADDRESS_API}/api/wirecard-signature/create`, data, httpOptions);
    }

    verificarAssinaturaAtiva(idAluno?: string): Observable<any> {
        return this.http.get<ApiResponse>(`${ADDRESS_API}/api/wirecard-signature/check-status-subscriber/${idAluno}`);
    }

    cancelarAssinatura(code): Observable<any> {
        return this.http.put<ApiResponse>(`${ADDRESS_API}/api/wirecard-signature/cancel-signature/${code}`, [], httpOptions);
    }

}
