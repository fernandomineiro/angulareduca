import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from 'src/app/calendar/calendar.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CalendarEffects } from './store/calendar.effects';

import * as fromCalendar from './store/calendar.reducer';

import {
    DayService,
    MonthAgendaService,
    MonthService,
    RecurrenceEditorModule,
    ScheduleModule, WeekService,
    WorkWeekService
} from '@syncfusion/ej2-angular-schedule';
import {SharedModule} from "../shared/shared.module";

@NgModule({
    declarations: [
        CalendarComponent
    ],
    imports: [
        CommonModule,
        ScheduleModule,
        SharedModule,
        StoreModule.forFeature('calendar', fromCalendar.calendarReducer),
        EffectsModule.forFeature([CalendarEffects])
    ],
    exports: [CalendarComponent],
    providers: [
        DayService,
        WeekService,
        WorkWeekService,
        MonthService,
        MonthAgendaService,
    ],
    bootstrap: [CalendarComponent]
})
export class CalendarModule {

}
