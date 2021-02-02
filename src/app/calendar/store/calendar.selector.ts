import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState } from './calendar.reducer';

const calendarSelector = createFeatureSelector<CalendarState>('calendar');

export const calendar = createSelector(calendarSelector, (state: CalendarState) => {
    return state.calendar;
});
