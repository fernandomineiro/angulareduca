import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ItvComponent } from './itv.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from '../../shared/shared.module';
import { CalendarModule } from '../../calendar/calendar.module';
import * as fromITV from './store/itv.reducer';
import { ItvEffects } from './store/itv.effects';
import {RouterModule} from '@angular/router';
import {AppModule} from "../../app.module";

@NgModule({
    declarations: [
        ItvComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        HttpClientModule,
        SlickCarouselModule,
        CalendarModule,
        RouterModule.forChild([]),
        StoreModule.forFeature('itv', fromITV.itvReducer),
        EffectsModule.forFeature([ItvEffects])
    ],
    exports: [ItvComponent],
    providers: [],
    bootstrap: [ItvComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ItvModule {

}
