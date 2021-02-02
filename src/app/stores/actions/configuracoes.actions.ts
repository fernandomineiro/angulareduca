import { Action } from '@ngrx/store';
import {ConfiguracoesState} from '../reducers/configuracoes.reducer';

export enum ConfiguracoesActionTypes {
    ConfiguracoesLoad = '[Configuracoes] Action'
}

export class ConfiguracoesLoad implements Action {
    readonly type = ConfiguracoesActionTypes.ConfiguracoesLoad;

    constructor(public payload: { data: ConfiguracoesState }) { }
}

export type ConfiguracoesActions = ConfiguracoesLoad;
