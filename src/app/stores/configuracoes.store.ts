import { Store } from './store';

import { ConfiguracaoState } from './states/configuracao.state';
import { Injectable } from '@angular/core';
import {Configuracao} from '../configuracao.model';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracoesStore extends Store<ConfiguracaoState> {

    constructor() {
        super(new ConfiguracaoState());
    }

    updateConfiguracao(configuracao: any): void {
        const downloadingImage = new Image();
        downloadingImage.src = this.state.url + configuracao.logo.url_logtipo;
        // configuracao.layoutHome = 4
        this.setState({
            ...this.state,
            configuracao
        });
    }
}
