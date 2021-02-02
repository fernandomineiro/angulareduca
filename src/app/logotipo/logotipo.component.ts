import {Component, Input, OnInit} from '@angular/core';
import { ConfiguracoesStore } from '../stores/configuracoes.store';
import {Configuracao} from '../configuracao.model';

@Component({
    selector: 'app-mt-logotipo',
    templateUrl: './logotipo.component.html',
    styleUrls: ['./logotipo.component.css']
})
export class LogotipoComponent implements OnInit {

    // @ts-ignore
    configuracoes: any;
    urlLogo: string = '';

    // tslint:disable-next-line:no-input-rename
    @Input('style')
    myStyles;

    constructor(
        private configuracoesStore: ConfiguracoesStore,
    ) {
        this.configuracoesStore.state$.subscribe(state => {
            this.configuracoes = state.configuracao;
            this.urlLogo = state.url;
        });
    }

    ngOnInit(): void {

    }

    get logotipo() {
        let urlLogotipo = '../../assets/img/Educaz_preto.png';
        if (this.configuracoes) {
            urlLogotipo = this.urlLogo + this.configuracoes.logo.url_logtipo;
        }
        if(this.configuracoes.layoutHome == 4){
           urlLogotipo = '../assets/img/perennials/logo-perennials-branco.png';
        }

        return urlLogotipo;
    }

    get styles() {

        let styles = {};
        if (this.myStyles) {
            styles = this.myStyles;
        }
        if(this.configuracoes.layoutHome == 4)
            styles['max-height'] = '50px'

        return styles;
    }
}
