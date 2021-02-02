import { Trilha } from './home.model';
import {HomeActions, HomeActionTypes} from './home.actions';

export interface HomeState {
    trilhas: Trilha[];
}

export const initialHomeState: HomeState = {
    trilhas: [],
};

export function homeReducer(
    state = initialHomeState,
    action: HomeActions
): HomeState {
    switch (action.type) {
        case HomeActionTypes.LoadTrilhas:
            return initialHomeState;
        case HomeActionTypes.TrilhasSuccess:
            return {
                trilhas: action.payload.trilhas
            };
        default:
            return state;
    }
}