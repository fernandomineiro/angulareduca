import { Action } from '@ngrx/store';
import { Calendar } from './calendar.model';

export enum CalendarActionTypes {
    CalendarLoad = '[Calendar Load] Action',
    CalendarSuccess = '[Calendar Success] Action',
    CalendarFail = '[Calendar Fail] Action'
}

export class CalendarLoad implements Action {
    readonly type = CalendarActionTypes.CalendarLoad;

    constructor(public payload: { id: string }) { }
}

export class CalendarSuccess implements Action {
    readonly type = CalendarActionTypes.CalendarSuccess;

    constructor( public payload: { calendar: Calendar[] }) { }
}

export class CalendarFail implements Action {
    readonly type = CalendarActionTypes.CalendarFail;

    constructor(public payload: { error: string }) { }
}

export type CalendarActions = CalendarLoad | CalendarSuccess | CalendarFail;
