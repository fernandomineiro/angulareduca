import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import {BehaviorSubject, Observable, of} from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { ADDRESS_API } from '../../app.api';
import { User } from './user.model';

import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from '../../shared/messages/notification.service';

import { environment } from '../../../environments/environment';
import { LoginStore } from '../../stores/login.store';
import * as _ from 'underscore';
import {Store} from '@ngrx/store';
import {AppState} from '../../index.reducers';
import {Login, Logout} from './store/login.actions';
import {LoginModel} from './store/login.model';
import {Perfil} from '../../perfil/perfil.enum';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    user: User;
    lastUrl: string;
    faculdade: string;
    accessToken: string;
    foto: string;
    membership: any;

    private currentEndpointObject = new BehaviorSubject([]);
    currentEndpoint = this.currentEndpointObject.asObservable();

    perfil: Array<any> = [{
        1: 'Professor',
        2: 'Administrador',
        3: '',
        4: 'Curador',
        5: 'Produtora',
        6: '',
        7: 'Gestor de Conteúdo IES',
        8: 'Gestor Comercial IES',
        9: 'Coordenador Acadêmico',
        10: 'Financeiro IES',
        11: 'Marketing IES',
        12: 'Atendimento IES',
        13: 'Secretaria IES',
        14: 'Aluno',
        15: 'Universidade',
    }];

    constructor(
        private http: HttpClient,
        private router: Router,
        private notificationService: NotificationService,
        private loginStore: LoginStore,
        private store: Store<AppState>
    ) {
        this.router.events.pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => this.lastUrl = e.url);

        this.user = JSON.parse(localStorage.getItem('user') || null);
        this.faculdade = localStorage.getItem('faculdade') || null;
        this.foto = localStorage.getItem('foto') || null;
        this.accessToken = localStorage.getItem('token') || null;
        this.membership = JSON.parse(localStorage.getItem('membership')) || null;
    }

    isLoggedIn(): boolean {

        if (this.accessToken) {
            const jwtHelper = new JwtHelperService();
            const isExpired = jwtHelper.isTokenExpired(this.accessToken);

            if (isExpired) {
                const carrinho = localStorage.getItem('carrinho');
                localStorage.clear();
                if (carrinho) {
                    localStorage.setItem('carrinho', carrinho);
                    this.loginStore.updateCurrentUser(null);
                }
                // @ts-ignore
            } else if (!this.loginStore.state$.source.value.user) {
                this.loginStore.updateCurrentUser(JSON.parse(localStorage.getItem('user') || null));
            }

            return !isExpired;
        }

        return false;
    }

    getExpirationDate() {
        const jwtHelper = new JwtHelperService();
        return jwtHelper.getTokenExpirationDate(this.accessToken);
    }

    getDecodedToken() {
        const jwtHelper = new JwtHelperService();
        return jwtHelper.decodeToken(this.accessToken);
    }

    changeCurrentEndpoint(currentValue) {
        this.currentEndpointObject.next(currentValue);
    }

    getPerfil(): number {
        return JSON.parse(localStorage.getItem('perfil') || null);
    }

    login(email: string, password: string, e: string): Observable<any> {
        const data = {
            email: email,
            password: password,
            recaptcha: e,
            fk_faculdade_id: environment.faculdade_id
        };

        const self = this;
        return this.http.post<any>(`${ADDRESS_API}/api/login`, data, httpOptions)
            .pipe(tap(retorno => {
                return self._processarRetorno(retorno);
            }));
    }

    loginAcessoRestrito(email: string, password: string, e: string): Observable<any> {
        const data = {
            email,
            password,
            recaptcha: e,
            fk_faculdade_id: environment.faculdade_id
        };

        const self = this;
        return this.http.post<any>(`${ADDRESS_API}/api/loginAcessoRestrito`, data, httpOptions)
            .pipe(tap(retorno => {
                return self._processarRetorno(retorno);
            }));
    }

    loginKroton(cpfaluno: string): Observable<any> {
        const data = {
            cpfaluno
        };

        const self = this;
        return this.http.post<any>(`${ADDRESS_API}/api/login-kroton`, data, httpOptions)
            .pipe(tap(retorno => {
                return self._processarRetorno(retorno);
            }));
    }

    _processarRetorno(retorno) {
        if (retorno && retorno.token) {
            this.user = retorno.user;
            this.faculdade = retorno.faculdade;
            this.accessToken = retorno.token;
            this.foto = retorno.user.foto ? retorno.user.foto : null;
            this.membership = retorno.membership ? retorno.membership : null;
            this.saveUserLocalStorage();
            this.loginStore.updateCurrentUser(retorno.user);


            const data: LoginModel = {
                userN: localStorage.getItem('userN') || null,
                user: JSON.parse(localStorage.getItem('user') || null),
                perfil: localStorage.getItem('perfil') || null,
                faculdade: localStorage.getItem('faculdade') || null,
                loggedIn: localStorage.getItem('loggedIn') || null,
                krotonAccess: localStorage.getItem('krotonAccess') || null,
                perfilNome: localStorage.getItem('perfilNome') || null,
                foto: localStorage.getItem('foto') || null,
                nome: localStorage.getItem('nome') || null,
                email: localStorage.getItem('email') || null,
                membership: JSON.parse(localStorage.getItem('membership') || null),
                pass: localStorage.getItem('pass') || null,
                usuario_id: localStorage.getItem('usuario_id') || null,
                token: localStorage.getItem('token') || null,
                meusCursos: {
                    isLoaded: false,
                    online: [],
                }
            };

            if (Number(localStorage.getItem('perfil')) == Perfil.Aluno) {
                this.store.dispatch(new Login({ data }));
            }
        }

        return retorno;
    }

    saveUserLocalStorage() {

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('usuario_id', this.user.id);
        localStorage.setItem('email', this.user.email);
        localStorage.setItem('nome', this.user.nome);
        localStorage.setItem('faculdade', this.faculdade);
        localStorage.setItem('perfil', this.user.fk_perfil);
        localStorage.setItem('perfilNome', this.perfil[0][this.user.fk_perfil] ? this.perfil[0][this.user.fk_perfil] : '');

        localStorage.setItem('membership', JSON.stringify(this.membership));
        localStorage.setItem('token', this.accessToken);
        localStorage.setItem('foto', this.foto ? this.foto : null);
        localStorage.setItem('user', JSON.stringify(this.user));

    }

    rememberMe(userNV: string, passV: string) {
        // instead of storing all of sensitive data, even user id, in the localStorage,
        // there should be implemented by using a server-side session
        localStorage.setItem('userN', userNV);
        localStorage.setItem('pass', passV);
    }

    removeRememberMe() {
        localStorage.setItem('userN', '');
        localStorage.setItem('pass', '');
    }

    logout() {
        localStorage.setItem('loggedIn', 'false');
        localStorage.removeItem('usuario_id');
        localStorage.removeItem('perfil');
        localStorage.removeItem('perfilNome');
        localStorage.removeItem('email');
        localStorage.removeItem('nome');
        localStorage.removeItem('token');
        localStorage.removeItem('foto');
        localStorage.removeItem('user');

        this.user = undefined;
        this.faculdade = undefined;
        this.accessToken = undefined;
        this.foto = undefined;

        this.store.dispatch(new Logout());
        this.router.navigate(['/']);
    }

    info(key: any) {
        localStorage.getItem(key);
    }

    handleLogin(path: string = this.lastUrl) {
        // this.router.navigate(['/', btoa(path)]);
        this.logout();
        this.notificationService.notify('Você foi deslogado, por favor efegue o login novamente para continuar seus estudos!');
        this.router.navigate(['/']);

    }

    recuperaSenha(email: string): Observable<any> {
        const data = { email };
        return this.http.post<any>(`${ADDRESS_API}/api/aluno/redefinir-senha`, data, httpOptions);
    }

    hasMembershipMentoria() {
        let membership = localStorage.getItem('membership') ? JSON.parse(localStorage.getItem('membership')) : null
        if (this.isLoggedIn() && membership && membership.type && membership.type.length) {
            let found = _.where(membership.type, { tipo_assinatura_id: 4 })
            return _.where(found, { status: 2 }).length > 0;
        }else
            return false;
    }
}
