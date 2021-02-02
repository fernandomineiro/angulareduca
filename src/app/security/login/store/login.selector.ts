import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../../../index.reducers';
import { LoginModel } from './login.model';
import { of } from 'rxjs';
import * as underscore from 'underscore';

const loginSelector = createFeatureSelector<AppState, LoginModel>('login');

export const login = createSelector(loginSelector, (state) => {
    return state;
});

export const meusCursosOnline = createSelector(loginSelector, (state: LoginModel) => {
    return state.meusCursos.online;
});

// export const meusCursosFavoritos = createSelector(loginSelector, (state: LoginModel) => {
//     return state.meusCursos.favoritos;
// });

export const isCourseBought = createSelector(loginSelector, (state: LoginModel, props) => {
    if (underscore.findWhere(state.meusCursos.online, { id: props.idCourse }) != undefined) {
        return true;
    }

    return false;
});
