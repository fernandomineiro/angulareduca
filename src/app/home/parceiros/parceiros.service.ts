import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { ApiResponse } from '../../app.api'
import { ADDRESS_API } from '../../app.api'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParceirosService {
  IMG_URL = environment.img_url;

  constructor(private http: HttpClient) {
    
  }

  getParceiros(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/configuracao/${environment.faculdade_id}/parceiros`);
  }
}
