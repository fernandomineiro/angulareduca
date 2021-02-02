import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API } from 'src/app/app.api';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) { }

  public changeNavColor: Subject<any> = new Subject<any>();
  public selectedItem: Subject<any> = new Subject<any>();

  public changeBanner: Subject<any> = new Subject<any>();

  public changeShoppingCartAmount: Subject<any> = new Subject<any>();

  getBanner(idFaculdade, page): Observable<any> {
    return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${idFaculdade}/${page}/banners`);
  }

  getBannerSecundario(idFaculdade): Observable<any> {
    return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${idFaculdade}/bannersSecundarios`);
  }

  getBannerCategoria(idFaculdade, page, idCategoria): Observable<any> {
    return this.http.get<any>(`${ADDRESS_API}/api/configuracao/${idFaculdade}/${page}/${idCategoria}/banners`);
  }
}
