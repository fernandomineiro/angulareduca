import { Calendar } from './calendar.model';
import {CalendarActions, CalendarActionTypes} from './calendar.actions';

export interface CalendarState {
    error: string;
    calendar: Calendar[];
}

export const initialCalendarState: CalendarState = {
    error: null,
    calendar: null
};

export function calendarReducer(
    state = initialCalendarState,
    action: CalendarActions
): CalendarState {
    switch (action.type) {
        case CalendarActionTypes.CalendarLoad:
            return initialCalendarState;
        case CalendarActionTypes.CalendarSuccess:
            return {
                error: null,
                calendar: action.payload.calendar
            };
        case CalendarActionTypes.CalendarFail:
            return {
                error: action.payload.error,
                calendar: null
            };
        default:
            return state;
    }
}
