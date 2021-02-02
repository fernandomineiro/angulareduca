import { Injectable } from '@angular/core';
import { Perfil } from '../perfil/perfil.enum';
import { LoginService } from '../security/login/login.service';
import { PerfilService } from '../perfil/perfil.service';

@Injectable({
  providedIn: 'root'
})
export class PermissoesService {
  rotas: object = {};

  constructor(
    private perfilService: PerfilService
  ) {
    this.rotas = this.rotasPorUsuariosQuePodemAcesssar();   
  }

  rotasPorUsuariosQuePodemAcesssar(): object {
    // tslint:disable: max-line-length
    return {
      'acesso-restrito/relatorios/historico-escolar': this.perfilService.verificaTipoDoUsuario(Perfil.SecretariaIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Administrador),
      'acesso-restrito/graficos/faturamento-comparativo': this.perfilService.verificaTipoDoUsuario(Perfil.Administrador) || this.perfilService.verificaTipoDoUsuario(Perfil.MarketingIes) || this.perfilService.verificaTipoDoUsuario(Perfil.FinanceiroIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Professor) || this.perfilService.verificaTipoDoUsuario(Perfil.GestorIes),
      'acesso-restrito/graficos/faturamento-por-professor': this.perfilService.verificaTipoDoUsuario(Perfil.Administrador) || this.perfilService.verificaTipoDoUsuario(Perfil.MarketingIes) || this.perfilService.verificaTipoDoUsuario(Perfil.FinanceiroIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Professor) || this.perfilService.verificaTipoDoUsuario(Perfil.GestorIes),
      'acesso-restrito/relatorios/alunos': this.perfilService.verificaTipoDoUsuario(Perfil.MarketingIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Curador) || this.perfilService.verificaTipoDoUsuario(Perfil.GestorIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Administrador),
      'acesso-restrito/graficos/pedidos': this.perfilService.verificaTipoDoUsuario(Perfil.FinanceiroIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Curador) || this.perfilService.verificaTipoDoUsuario(Perfil.GestorIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Administrador),
      'acesso-restrito/graficos/assinaturas': this.perfilService.verificaTipoDoUsuario(Perfil.Curador) || this.perfilService.verificaTipoDoUsuario(Perfil.GestorIes) || this.perfilService.verificaTipoDoUsuario(Perfil.Administrador),
    };
    // tslint:enable: max-line-length
  } 

  verificaSeUsuarioPodeAcessar(rotaUrl: string): boolean {
    return this.rotas[rotaUrl] && this.rotas[rotaUrl];
  }
}
