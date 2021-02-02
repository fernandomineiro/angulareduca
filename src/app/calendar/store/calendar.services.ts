import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API } from '../../app.api';

@Injectable({
    providedIn: 'root'
})
export class CalendarServices {
    constructor( private http: HttpClient ) {}

    loadCalendar(id) {
        return this.http.get<any>(`${ADDRESS_API}/api/itv/cursos/${id}/calendario`);
    }
}
