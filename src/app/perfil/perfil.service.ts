import { Injectable } from '@angular/core';
import { LoginService } from '../security/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private loginService: LoginService,
  ) { }

  verificaTipoDoUsuario(perfilId: number): boolean {
    return perfilId === this.loginService.getPerfil();
  }
}
