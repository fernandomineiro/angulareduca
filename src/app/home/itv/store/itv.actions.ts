import { Action } from '@ngrx/store';
import { Estrutura } from './itv.model';

export enum ITVActionTypes {
    ItvLoadCursos = '[ITV Load Cursos] Action',
    ItvLoadSuccess = '[ITV Load Success] Action',
    ItvLoadFail = '[ITV Load Fail] Action',
}

export class ItvLoadCursos implements Action {
    readonly type = ITVActionTypes.ItvLoadCursos;

    constructor(public payload: { idUsuario: string }) {}
}

export class ItvLoadSuccess implements Action {
    readonly type = ITVActionTypes.ItvLoadSuccess;

    constructor(public payload: { data: Estrutura[] }) {}
}

export class ITVLoadFail implements Action {
    readonly type = ITVActionTypes.ItvLoadFail;

    constructor(public payload: { error: string }) {}
}

export type ItvActions = ItvLoadCursos | ItvLoadSuccess | ITVLoadFail;
