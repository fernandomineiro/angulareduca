import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"

import { LoginService } from '../security/login/login.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'mt-acesso-restrito',
  templateUrl: './acesso-restrito.component.html',
  styles: [`
    #page-agenda .navbar { background-color: #DBDADA !important; }
    #mobile_navbar { background-color: #DBDADA !important; }
  `]
})
export class AcessoRestritoComponent implements OnInit {

  nome: string
  foto: string
  IMG_URL = environment.s3_url;

  constructor(private loginService: LoginService, private router: Router) {
    if (! this.isLoggedIn()) {
      this.router.navigate(['/'])
    }
  }

  ngOnInit() {
    this.nome = localStorage.getItem('nome')
    this.foto = localStorage.getItem('foto')
  }

  isLoggedIn() : boolean {
    return this.loginService.isLoggedIn()
  }

  nomeLogado() : string {
    return localStorage.getItem('nome')
  }
}
