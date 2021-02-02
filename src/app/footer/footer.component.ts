import { Component, OnInit } from '@angular/core';
import { LoginService } from '../security/login/login.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {LoginStore} from '../stores/login.store';
import {ConfiguracoesStore} from '../stores/configuracoes.store';
import {Configuracao} from '../configuracao.model';

@Component({
  selector: 'app-mt-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  IMG_URL = environment.img_url;
  isQuemSomos = false;
  krotonAccess = false;
  route: any;
environmentTemplate = environment;
  configuracoes: Configuracao;
  
  constructor(
      private loginService: LoginService,
      private router: Router, location: Location,
      private configuracoesStore: ConfiguracoesStore,
      private loginStore: LoginStore,
  ) {
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
    });

    this.router.events.subscribe(val => {    
        this.route = 'home';

        if (location.path() != '') {
          this.route = location.path();
        }

        this.isQuemSomos = false;
        if (this.route.includes('/quem-somos')) {
          this.isQuemSomos = true;
        }

        if (this.route.includes('/kroton-login') || localStorage.getItem('krotonAccess') == 'Sim') {
          this.krotonAccess = true;
          localStorage.setItem('krotonAccess', 'Sim');
        }
    });
  }

  ngOnInit() {

  }

  setLoginAcessoRestrito() {
    this.loginStore.updateCurrentEndpoint({
      value: 'login',
      title: 'Acesso Restrito',
      endpoint: 'loginAcessoRestrito',
      hasCadastro: false
    });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getPerfil(): number {
    return this.loginService.getPerfil();
  }
}
