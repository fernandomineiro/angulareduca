import { Action } from '@ngrx/store';
import {Trilha} from './home.model';

export enum HomeActionTypes {
    LoadTrilhas = '[Trilhas] LoadAction',
    TrilhasSuccess = '[Trilhas] SuccessAction'
}

export class LoadTrilhas implements Action {
    readonly type = HomeActionTypes.LoadTrilhas;
}

export class TrilhasSuccess implements Action {
    readonly type = HomeActionTypes.TrilhasSuccess;

    constructor(public payload: { trilhas: Trilha[] }) { }
}

export type HomeActions = LoadTrilhas | TrilhasSuccess;
