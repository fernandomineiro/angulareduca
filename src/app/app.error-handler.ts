import {ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

// import {throwError } from 'rxjs/operators'

import { NotificationService } from './shared/messages/notification.service';
import { LoginService } from './security/login/login.service';

@Injectable()
export class AplicationErrorHandler extends ErrorHandler {

  constructor(private ns: NotificationService, 
              private injector: Injector,
              private zone: NgZone) {
    super();
  }

  handleError(errorResponse: HttpErrorResponse | any) {
    if (errorResponse instanceof HttpErrorResponse) {

      const message = errorResponse.error.message;
      this.zone.run(() => {
        switch (errorResponse.status) {
          case 401:
            this.injector.get(LoginService).handleLogin();
            break;

          case 403:
            this.ns.notify(message || 'Não autorizado.');
            break;

          case 404:
            this.ns.notify(message || 'Recurso não encontrado. Verifique o console para mais detalhes.');
            break;

          default:
            // removido via solicitação trello: ED2-1319
            // this.ns.notify('Uma mensagem já foi enviada à área técnica. Desculpe pelo transtorno.');
        }
      }, {passive: true});
    }
    super.handleError(errorResponse);
  }
}
