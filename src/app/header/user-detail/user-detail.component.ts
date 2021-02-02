import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../security/login/login.service';
import { User } from '../../security/login/user.model';
import { Router } from "@angular/router"
import { environment } from 'src/environments/environment';
import {LoginStore} from '../../stores/login.store';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';

@Component({
  selector: 'mt-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']  
})
export class UserDetailComponent implements OnInit {
  IMG_URL = environment.img_url
  configuracoes
  
  constructor(private loginService: LoginService, private router: Router, private loginStore: LoginStore,private configuracoesStore: ConfiguracoesStore,) { }

  ngOnInit() {
    this.setLogin();
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao
    });
  }

  setLogin() {
    this.loginStore.updateCurrentEndpoint({
      value: 'login',
      title: 'Faça seu login',
      endpoint: 'loginAluno',
      hasCadastro: true
    });
  }

  nomeLogado(): string {
    return localStorage.getItem('nome');
  }

  perfilLogado(): string {
      return localStorage.getItem('perfil');
  } 

  perfilNomeLogado(): string {
      return localStorage.getItem('perfilNome');
  }       

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  login() {
    this.loginService.handleLogin();
  }

  logout() {
    this.loginService.logout()
    this.router.navigate(['/']);
  }

}
