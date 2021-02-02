import {Component, OnInit, ViewChild} from '@angular/core';
import {LoginService} from '../../security/login/login.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

    constructor(
        private loginService: LoginService
    ) {

    }

    ngOnInit(): void {

    }

    get perfil(): number {
        return this.loginService.getPerfil();
    }
}
