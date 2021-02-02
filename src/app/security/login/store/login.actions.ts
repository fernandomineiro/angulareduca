import { Action } from '@ngrx/store';
import { Curso, LoginModel } from './login.model';

export enum LoginActionTypes {
    LoginAction = '[Login] Action',
    LogoutAction = '[Logout] Action',
    MeusCursosLoad = '[MeusCursos] Load Action',
    OnlineSuccess = '[OnlineSuccess] Online Success Action',
    FavoritosSuccess = '[FavoritosSuccess] Favorites Success Action'
}

export class Login implements Action {
    readonly type = LoginActionTypes.LoginAction;

    constructor(public payload: { data: LoginModel }) { }
}

export class Logout implements Action {
    readonly type = LoginActionTypes.LogoutAction;
}

export class MeusCursosLoad implements Action {
    readonly type = LoginActionTypes.MeusCursosLoad;
}

export class OnlineSuccess implements Action {
    readonly type = LoginActionTypes.OnlineSuccess;

    constructor(public payload: { online: Curso[] }) { }
}

export class FavoritosSuccess implements Action {
    readonly type = LoginActionTypes.FavoritosSuccess;

    constructor(public payload: { favoritos: Curso[] }) { }
}

export type LoginActions = Login | Logout | OnlineSuccess | MeusCursosLoad | FavoritosSuccess ;
