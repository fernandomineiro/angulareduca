import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AppState} from '../../index.reducers';
import {HomeState} from './home.reducer';

const homeSelector = createFeatureSelector<AppState, HomeState>('home');

export const trilhas = createSelector(homeSelector, (state: HomeState) => {
    console.log(state)
    return state.trilhas;
});
