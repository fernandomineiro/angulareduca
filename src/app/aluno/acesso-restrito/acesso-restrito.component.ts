import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../security/login/login.service';
import { CursosService } from 'src/app/curso/cursos.service';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { HeaderService } from 'src/app/header/header.service';
import { PedidoService } from '../../pedido/pedido.service';
import { TutoriaService } from '../../tutoria/tutoria.service';

import { environment } from 'src/environments/environment';
import { MeusCursosComponent } from './meus-cursos/meus-cursos.component';
import {FavoritosComponent} from './favoritos/favoritos.component';
import {CertificadosComponent} from './certificados/certificados.component';
import {MeusTrabalhosComponent} from './meus-trabalhos/meus-trabalhos.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {Configuracao} from '../../configuracao.model';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'mt-aluno-acecsso-restrito',
  templateUrl: './acesso-restrito.component.html',
  styleUrls: ['./acesso-restrito.component.css']
})
export class AlunoAcessoRestritoComponent implements OnInit {
  IMG_URL = environment.img_url
  // later need to change the img_url of environment instead of setting it
  // setting now, affects the other pictures
  IMG_URL_TMP = environment.s3_url;
  IMG_URL_SRC: string;

  nome: string;
  perfil: any;

  apiResponse: any;
  estatisticas: any;
  error: string;

  configuracoes: Configuracao;

  constructor(
        private loginService: LoginService,
        public router: Router,
        private cursosService: CursosService,
        private alunoService: AlunoService,
        private headerService: HeaderService,
        private configuracoesStore: ConfiguracoesStore,

  ) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
      if (this.router.url == '/perfil') {
          this.router.navigate(['/perfil/cursos']);
      }

      this.configuracoesStore.state$.subscribe(state => {
          this.configuracoes = state.configuracao;
          const confNavColor =
              state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
          this.headerService.changeNavColor.next(confNavColor);
      });


      this.headerService.selectedItem.next('user');
      this.IMG_URL_SRC = '../assets/img/default_avatar.jpg';

      this.perfil = {
          nome: this.loginService.user.nome,
          email: this.loginService.user.email,
          perfil: this.loginService.getPerfil(),
          faculdade: this.loginService.faculdade,
      };

      this.IMG_URL_SRC = '../assets/img/default-avatar.png';
      if (this.loginService.foto) {
          this.IMG_URL_SRC = this.IMG_URL_TMP + '/files/usuario/' + this.loginService.foto;
      }
      this.cursosService
          .getMinhasEstatisticas(localStorage.getItem('usuario_id'))
          .subscribe((ApiResponse) => {
              this.estatisticas = ApiResponse.items;
              console.log(this.estatisticas);
          });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  nomeLogado(): string {
    return localStorage.getItem('nome');
  }

  scrollTop(event) {
    window.scroll(0,0);
  }

  decimalHoras(horas): string {
    var horasDecimal = parseFloat(horas);    
    return (""+Math.floor(horasDecimal));
  }

  decimalMinutos(horas): string {
    var horasDecimal = parseFloat(horas);   
    var minutos = Math.floor((horasDecimal - Math.floor(horasDecimal))*60);
    var minutosF = ("0" + minutos).slice(-2);
    return (""+minutosF);
  }
  
}
