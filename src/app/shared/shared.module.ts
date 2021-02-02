import {NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { InputComponent } from './input/input.component';
import { RadioComponent } from './radio/radio.component';
import { RatingComponent } from './rating/rating.component';

import { SnackbarComponent } from './messages/snackbar/snackbar.component';
import { NotificationService } from './messages/notification.service';

import { LoginService } from '../security/login/login.service';
import { LoggedInGuard } from '../security/loggedin.guard';
import { AuthInterceptor } from '../security/auth.interceptor';

import { DataTablesModule } from 'angular-datatables';
import {SafePipe} from '../safe.pipe';
import {CardCursosOnlineComponent} from '../curso/cursos-online/card-cursos-online/card-cursos-online.component';
import {RouterModule} from '@angular/router';
import {NgxCurrencyModule} from 'ngx-currency';
import {CertificadosComponent} from '../aluno/acesso-restrito/certificados/certificados.component';
import {MeusTrabalhosComponent} from '../aluno/acesso-restrito/meus-trabalhos/meus-trabalhos.component';
import {DialogComponent} from '../header/dialog/dialog.component';
import {MeusCursosComponent} from '../aluno/acesso-restrito/meus-cursos/meus-cursos.component';
import {FavoritosComponent} from '../aluno/acesso-restrito/favoritos/favoritos.component';
import {PedidosComponent} from '../aluno/acesso-restrito/pedidos/pedidos.component';
import {MenuItvComponent} from "../home/itv/menu-itv/menu-itv.component";

@NgModule({
    declarations: [
        InputComponent, RadioComponent, RatingComponent, SnackbarComponent, SafePipe, CardCursosOnlineComponent,
        MenuItvComponent
    ],
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, DataTablesModule, RouterModule.forChild([]),
        NgxCurrencyModule,
    ],
    exports: [
        InputComponent, RadioComponent, SnackbarComponent,
              RatingComponent, CommonModule, 
              FormsModule, ReactiveFormsModule, DataTablesModule, SafePipe, CardCursosOnlineComponent,
        MenuItvComponent
    ],
    entryComponents: [
        CardCursosOnlineComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                            DatePipe,
                            NotificationService,
                            LoginService,
                            LoggedInGuard,
                            { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
                        ]
        };
    }
}
