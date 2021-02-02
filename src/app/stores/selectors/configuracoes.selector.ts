import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from '../../index.reducers';
import {ConfiguracoesState} from '../reducers/configuracoes.reducer';

const configuracoesSelector = createFeatureSelector<AppState, ConfiguracoesState>('configuracoes');

export const configuracoes = createSelector(configuracoesSelector, (state: ConfiguracoesState) => {
    return state;
});
