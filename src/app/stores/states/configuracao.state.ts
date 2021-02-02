import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Configuracao} from '../../configuracao.model';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracaoState {
    configuracao: Configuracao;
    url: string = (environment.api + '/files/logotipos/');
}
