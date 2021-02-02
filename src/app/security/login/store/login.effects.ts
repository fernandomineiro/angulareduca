import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {defer, of} from 'rxjs';
import {FavoritosSuccess, Login, LoginActionTypes, MeusCursosLoad, OnlineSuccess} from './login.actions';
import {LoginModel} from './login.model';
import {CursosService} from '../../../curso/cursos.service';
import {catchError, map, switchMap} from 'rxjs/operators';
import {LoginService} from '../login.service';
import {Perfil} from '../../../perfil/perfil.enum';

@Injectable()
export class LoginEffects {

    @Effect()
    loadMeusCursosOnline = this.actions$.pipe(
        ofType<MeusCursosLoad>(LoginActionTypes.MeusCursosLoad),
        switchMap(action => {
            return this.cursosService.getCursosOnlinePorAluno(this.loginService.user.id).pipe(
                map(
                    response => {
                        return new OnlineSuccess({
                            online: response.items
                        });
                    }
                ),
                catchError( error => { console.log(error); return of({}); })
            );
        })
    );

    @Effect()
    init$ = defer(() => {

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
                online: []
            }
        };

        if (this.loginService.isLoggedIn() && Number(localStorage.getItem('perfil')) == Perfil.Aluno) {
            return of(
                new Login({ data }),
                new MeusCursosLoad()
            );
        }

        return of(
            new Login({ data })
        );
    });

    constructor(
       private actions$: Actions,
       private cursosService: CursosService,
       private loginService: LoginService
    ) { }
}
