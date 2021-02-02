import {createFeatureSelector, createSelector} from '@ngrx/store';
import { ItvState } from './itv.reducer';

const itvSelector = createFeatureSelector<ItvState>('itv');

export const estruturas = createSelector(itvSelector, (state: ItvState) => {
    return state.estruturas;
});

export const error = createSelector(itvSelector, (state: ItvState) => {
    return state.error;
});
