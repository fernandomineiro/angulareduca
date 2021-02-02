import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ConfiguracaoService } from '../../configuracao.service';
import { environment } from '../../../environments/environment';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ConfiguracoesLoad} from '../actions/configuracoes.actions';
import {Title} from '@angular/platform-browser';
import {ConfiguracoesStore} from '../configuracoes.store';

@Injectable()
export class ConfiguracoesEffects {
    @Effect()
    init$ = this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        switchMap( (action) => {
            return this.configuracoesService.getConfiguracoesFaculdade(environment.faculdade_id).pipe(
                map(
                    response => {
                        //response.items.layoutHome = 0;

                        if (response.items.tiposCursosAtivos.descricao) {
                            this.titleService.setTitle(response.items.tiposCursosAtivos.descricao);
                        }

                        const link = document.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.type = 'text/css';
                        link.href = environment.api + '/frontcss/' + environment.faculdade_id + '/style.css';

                        document.head.appendChild(link);


                        const favicon = document.createElement('link');
                        favicon.setAttribute('rel', 'shortcut icon');
                        favicon.href = environment.api + '/favicons/' + environment.faculdade_id + '/favicon.ico';

                        document.head.appendChild(favicon);

                        if (response.items.ga) {

                            const trackingID = response.items.ga.id_visualizacao;
                            const gaScript = document.createElement('script');
                            gaScript.setAttribute('async', 'true');
                            gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ trackingID }`);

                            const gaScript2 = document.createElement('script');
                            // tslint:disable-next-line:max-line-length
                            gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${ trackingID }\');`;

                            const gaScript3 = document.createElement('script');

                            gaScript2.innerText = `(function(i, s, o, g, r, a, m) {
                                                i['GoogleAnalyticsObject'] = r;
                                                i[r] = i[r] || function() {
                                                    (i[r].q = i[r].q || []).push(arguments)
                                                }, i[r].l = 1 * new Date();
                                                a = s.createElement(o),
                                                    m = s.getElementsByTagName(o)[0];
                                                a.async = 1;
                                                a.src = g;
                                                m.parentNode.insertBefore(a, m)
                                            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
                                            
                                            ga('create', '${ trackingID }', 'auto');// add your tracking ID here.
                                            ga('send', 'pageview');`;


                            document.documentElement.firstChild.appendChild(gaScript);
                            document.documentElement.firstChild.appendChild(gaScript2);
                            document.documentElement.firstChild.appendChild(gaScript3);
                        }

                        if (response.items.facebook) {

                            const facebookScript = document.createElement('script');
                            facebookScript.setAttribute('async', 'true');
                            facebookScript.innerText = `fbq('init', ${ response.items.facebook.id_visualizacao });`;

                            document.documentElement.firstChild.appendChild(facebookScript);
                        }

                        return new ConfiguracoesLoad({ data: response.items });
                    }
                ),
                catchError(error => { console.log('error', error ); return of(null); })
            );
        })
    );

    constructor(
        private actions$: Actions,
        private configuracoesService: ConfiguracaoService,
        private configuracaoStore: ConfiguracoesStore,
        private titleService: Title
    ) { }
}
