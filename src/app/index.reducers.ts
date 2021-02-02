import { LoginModel } from './security/login/store/login.model';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { loginReducer } from './security/login/store/login.reducer';
import { environment } from '../environments/environment';
import { configuracoesReducer, ConfiguracoesState } from './stores/reducers/configuracoes.reducer';
import { homeReducer, HomeState } from './home/store/home.reducer';

export interface AppState {
    login: LoginModel;
    configuracoes: ConfiguracoesState;
    home: HomeState;
}

export const reducers: ActionReducerMap<AppState> = {
    login: loginReducer,
    configuracoes: configuracoesReducer,
    home: homeReducer
};

export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];
