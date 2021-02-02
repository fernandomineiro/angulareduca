import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CursosService } from '../../../curso/cursos.service';
import {ITVActionTypes, ItvLoadCursos, ITVLoadFail, ItvLoadSuccess} from './itv.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Estrutura} from './itv.model';
import {Store} from '@ngrx/store';
import {OnlineSuccess} from '../../../security/login/store/login.actions';

@Injectable()
export class ItvEffects {

    @Effect()
    itvLoadCursos$ = this.actions$.pipe(
        ofType<ItvLoadCursos>(ITVActionTypes.ItvLoadCursos),
        switchMap(action => {
            return this.cursosService.getCursosITV(action.payload.idUsuario).pipe(
                map(
                    (response: Estrutura[]) => {
                        return new ItvLoadSuccess({ data: response });
                    }
                ),
                catchError(error => of(new ITVLoadFail({ error: error.message})))
            );
        }),
    );

    constructor(
       private actions$: Actions,
       private cursosService: CursosService,
       private store: Store
    ) {}
}
