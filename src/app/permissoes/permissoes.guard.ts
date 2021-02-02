import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissoesService } from './permissoes.service';

@Injectable({
  providedIn: 'root'
})
export class PermissoesGuard implements CanActivate {
  constructor(
    private permissoesService: PermissoesService, 
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.permissoesService.verificaSeUsuarioPodeAcessar(route.routeConfig.path);
  }
}
