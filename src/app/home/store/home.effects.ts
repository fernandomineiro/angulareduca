import {catchError, map, switchMap} from 'rxjs/operators';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {CursosService} from '../../curso/cursos.service';
import {Injectable} from '@angular/core';
import {TrilhasService} from '../../trilha-conhecimento/trilha-conhecimento.service';
import {HomeActionTypes, LoadTrilhas, TrilhasSuccess} from './home.actions';

@Injectable()
export class HomeEffects {

    @Effect()
    loadTrilhas$ = this.actions$.pipe(
        ofType<LoadTrilhas>(HomeActionTypes.LoadTrilhas),
        switchMap(() => {
            return this.trilhasService.getTrilhasHome().pipe(
                map(
                    (response) => {
                        return new TrilhasSuccess({ trilhas: response.items });
                    }
                ),
                catchError(error => of(false))
            );
        })
    );

    constructor(
        private actions$: Actions,
        private cursosService: CursosService,
        private trilhasService: TrilhasService,
    ) { }
}
