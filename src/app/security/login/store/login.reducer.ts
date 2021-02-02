import { Curso, Membership, User} from './login.model';
import {LoginActions, LoginActionTypes} from './login.actions';

export interface LoginState {
    userN: string;
    user: User;
    perfil: string;
    faculdade: string;
    loggedIn: string;
    krotonAccess: string;
    perfilNome: string;
    foto: string;
    nome: string;
    email: string;
    membership: Membership[];
    pass: string;
    usuario_id: string;
    token: string;
    meusCursos: {
        isLoaded: boolean,
        online: Curso[]
    };

}

export const initialLoginState: LoginState = {
    userN: null,
    user: null,
    perfil: null,
    faculdade: null,
    loggedIn: null,
    krotonAccess: null,
    perfilNome: null,
    foto: null,
    nome: null,
    email: null,
    membership: null,
    pass: null,
    usuario_id: null,
    token: null,
    meusCursos: {
        isLoaded: false,
        online: []
    }
};

export function loginReducer(
    state = initialLoginState,
    action: LoginActions
): LoginState {
    switch (action.type) {
        case LoginActionTypes.LoginAction:
            return {
                userN: action.payload.data.userN,
                user: action.payload.data.user,
                perfil: action.payload.data.perfil,
                faculdade: action.payload.data.faculdade,
                loggedIn: action.payload.data.loggedIn,
                krotonAccess: action.payload.data.krotonAccess,
                perfilNome: action.payload.data.perfilNome,
                foto: action.payload.data.foto,
                nome: action.payload.data.nome,
                email: action.payload.data.email,
                membership: action.payload.data.membership,
                pass: action.payload.data.pass,
                usuario_id: action.payload.data.usuario_id,
                token: action.payload.data.token,
                meusCursos: {
                    isLoaded: false,
                    online: []
                }
            };
        case LoginActionTypes.OnlineSuccess:
            return {
                ...state,
                meusCursos: {
                    isLoaded: true,
                    online: action.payload.online
                }
            };
        case LoginActionTypes.LogoutAction:
            return initialLoginState;
        default:
            return state;
    }
}
