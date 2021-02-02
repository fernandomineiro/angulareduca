import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CalendarActionTypes, CalendarFail, CalendarLoad, CalendarSuccess } from './calendar.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CalendarServices } from './calendar.services';
import { of } from 'rxjs';

@Injectable()
export class CalendarEffects {

    @Effect()
    calendarLoad = this.actions$.pipe(
        ofType<CalendarLoad>(CalendarActionTypes.CalendarLoad),
        switchMap(action => {
            return this.calendarService.loadCalendar(action.payload.id).pipe(
                map(
                    response => {
                        return new CalendarSuccess({
                            calendar: response
                        });
                    }
                ),
                catchError( error => of(new CalendarFail({ error: error.message })))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private calendarService: CalendarServices
    ) {}
}
