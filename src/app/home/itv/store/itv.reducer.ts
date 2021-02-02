import { Estrutura } from './itv.model';
import { ItvActions, ITVActionTypes } from './itv.actions';

export interface ItvState {
   estruturas: Estrutura[];
   error: string;
}

export const initialItvState: ItvState = {
    estruturas: [],
    error: null
};

export function itvReducer(
    state = initialItvState,
    action: ItvActions
): ItvState {
    switch (action.type) {
        case ITVActionTypes.ItvLoadCursos:
            return initialItvState;
        case ITVActionTypes.ItvLoadSuccess:
            return {
                error: null,
                estruturas: action.payload.data
            };
        case ITVActionTypes.ItvLoadFail:
            return {
                estruturas: null,
                error: action.payload.error
            };
        default:
            return state;
    }
}

