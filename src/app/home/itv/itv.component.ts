import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { LoginService } from 'src/app/security/login/login.service';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import { environment } from 'src/environments/environment';
import { LoginStore } from '../../stores/login.store';
import { DomSanitizer } from '@angular/platform-browser';
import { SubSink } from 'subsink';
import { Store } from '@ngrx/store';
import { ItvState } from './store/itv.reducer';
import { ItvLoadCursos } from './store/itv.actions';
import { estruturas } from './store/itv.selector';
import {MeusCursosLoad} from '../../security/login/store/login.actions';
import {AppState} from '../../index.reducers';

@Component({
  selector: 'app-itv',
  templateUrl: './itv.component.html',
  styleUrls: ['./itv.component.scss']
})
export class ItvComponent implements OnInit, OnDestroy {

    IMG_URL = environment.img_url;
    configuracoes;
    estruturas$;
    src = 'https://player.vimeo.com/video/';
    codigoVimeo = '374889836';
    subs = new SubSink();

  constructor(
      private headerService: HeaderService,
      private loginService: LoginService,
      private configuracoesStore: ConfiguracoesStore,
      private loginStore: LoginStore,
      public sanitizer: DomSanitizer,
      public store: Store<AppState>
  ) {

  }

  ngOnInit() {

  /**
   * 1 livre
   * 2 por data
   * 3 sequencia de liberação
   * 4 Por data e sequencia de liberação
   */
    if (!this.loginService.isLoggedIn()) {
        this.subs.sink = this.headerService.getBanner(environment.faculdade_id, 'home').subscribe((ApiResponse) => {
            this.headerService.changeBanner.next(ApiResponse.items);
        });
    }

    this.loginStore.updateCurrentEndpoint({
        value: 'login',
        title: 'Faça seu login',
        endpoint: 'loginAluno',
        hasCadastro: false
    });

    this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
        this.codigoVimeo = state.configuracao.tiposCursosAtivos.teaser ? state.configuracao.tiposCursosAtivos.teaser : this.codigoVimeo;
        this.src = this.src + this.codigoVimeo;
    });

    this.subs.sink = this.loginStore.state$.subscribe(state => {
        if (state.user) {
            if (this.loginService.isLoggedIn()) {
                this.store.dispatch(new ItvLoadCursos({ idUsuario: localStorage.getItem('usuario_id')}));
                this.store.dispatch(new MeusCursosLoad());
            }
        }
    });

    this.estruturas$ = this.store.select(estruturas);
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  isLoggedIn() {
      return this.loginService.isLoggedIn();
  }

  returnSlideConfig(element, cardWidth) {
      return {
          centerMode: false,
          slidesToShow: Math.floor(($(element).width() / cardWidth)),
          slidesToScroll: Math.floor(($(element).width() / cardWidth)),
          autoplay: true,
          infinite: true,
      };
  }

}
