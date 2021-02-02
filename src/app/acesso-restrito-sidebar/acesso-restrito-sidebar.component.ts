import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import { LoginService } from '../security/login/login.service';
import { Router } from '@angular/router';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import { HeaderService } from 'src/app/header/header.service';
import { Perfil } from '../perfil/perfil.enum';
import { PermissoesService } from '../permissoes/permissoes.service';

@Component({
  selector: 'app-acesso-restrito-sidebar',
  templateUrl: './acesso-restrito-sidebar.component.html',
  styleUrls: ['./acesso-restrito-sidebar.component.css']
})
export class AcessoRestritoSidebarComponent implements OnInit {

  unreadMessages: number
  modalBackdropElement: any
  configuracoes

  @Input()
  current1: string;
  @Input()
  current2: string;

  constructor(private acessoRestritoSidebarService: AcessoRestritoSidebarService, 
              private loginService: LoginService, 
              private router: Router,
              private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService,
              public permissoesService: PermissoesService
  ) { }

  ngOnInit() { 
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;    
    });
    try {
      this.acessoRestritoSidebarService.getTutoriaUnreadMessages(localStorage.getItem('usuario_id')).subscribe((unreadMessages) => {
        this.unreadMessages = unreadMessages.data;       
      });
    } catch (error) {
      console.log('Acesso restristo', error);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  get tiposPerfil() {
    return Perfil;
  }

  get perfilId() {
    return this.loginService.getPerfil();
  }
}
