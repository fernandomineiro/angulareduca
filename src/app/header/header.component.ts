import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, EmailValidator } from '@angular/forms';
import { HeaderService } from 'src/app/header/header.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as underscore from 'underscore';
import { environment } from 'src/environments/environment';
import $ from 'jquery';
import { CursosService } from '../curso/cursos.service';
import { PesquisarService } from '../pesquisar.service';
import { ConfiguracoesStore } from '../stores/configuracoes.store';
import { Configuracao } from '../configuracao.model';
import { LoginStore } from 'src/app/stores/login.store';
import { LoginService } from 'src/app/security/login/login.service';
import {SubSink} from 'subsink';

@Component({
  selector: 'mt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  IMG_URL = environment.img_url;

  loginForm: FormGroup;
  recoverForm: FormGroup;
  submitted = false;
  submittedRecover = false;
  navColor: string;
  selectedItem: string;
  route: any;
  isMobile: boolean;
  bannerInfo: any;
  currentBannerIndex = 0;
  hasBanner = false;
  isQuemSomos = false;
  removed;
  amountCarrinho = 0;
  environmentTemplate = environment;
  bannerHeight = '800px';

  configuracoes: Configuracao;
  krotonAccess: any = false;

  private subs = new SubSink();

  constructor(
    private cursosService: CursosService,
    private formBuilder: FormBuilder,
    private headerService: HeaderService,
    private pesquisarService: PesquisarService,
    location: Location,
    private router: Router,
    private configuracoesStore: ConfiguracoesStore,
    private loginStore: LoginStore,
    private loginService: LoginService
  ) {

    this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
    });

    this.subs.sink = this.router.events.subscribe(val => {

      this.hasBanner = false;
      this.route = 'home';

      if (location.path() != '') {
        this.route = location.path();
      }

      if (this.route == 'home' ||
        this.route == '/cursos-online' ||
        this.route == '/cursos-presenciais' ||
        this.route == '/cursos-remotos' ||
        this.route == '/eventos' ||
        this.route == '/professores' ||
        this.route == '/trilhas-conhecimento' ||
        this.route == '/seja-um-professor'
        // this.route == '/biblioteca' ||
      ) {
        this.hasBanner = true;
      }

      this.isQuemSomos = false;
      if (this.route.includes('/quem-somos')) {
        this.isQuemSomos = true;
      }

      if (this.route.includes('/kroton-login') || localStorage.getItem('krotonAccess') == 'Sim') {
        this.krotonAccess = true;
        localStorage.setItem('krotonAccess', 'Sim');
      }

      if ($('#web_navbar .navbar-toggler').attr('aria-expanded') != 'false') {
        $('.navbar-toggler').click();
      }

      this.checkBannerSize();
      if (this.configuracoes.layoutHome == 4) {
        this.navColor = '#EE5666';
      }

    });
  }

  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    $(window).on('resize', function () {
      this.isMobile = (window.innerWidth < 992) ? true : false;
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, EmailValidator]],
      password: ['', Validators.required]
    });

    this.recoverForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, EmailValidator]],
      cpf: ['', Validators.required]
    });

    this.subs.sink = this.headerService.changeShoppingCartAmount.subscribe((amount) => {
        this.amountCarrinho = amount;
    });

    if (localStorage.getItem('carrinho') != null) {
      this.headerService.changeShoppingCartAmount.next(JSON.parse(localStorage.getItem('carrinho')).length);
    }

    this.subs.sink = this.headerService.changeNavColor.subscribe((color) => {
        this.navColor = color;
        if (this.configuracoes.layoutHome == 4) {
            this.navColor = '#EE5666';
        }
    });

    this.subs.sink = this.headerService.selectedItem.subscribe((item) => {
      this.selectedItem = item;
    });

    this.subs.sink = this.headerService.changeBanner.subscribe((banner) => {

      if (banner.length == 0) {
        this.hasBanner = false;

      }
      this.checkBannerSize();

      this.currentBannerIndex = 0;
      this.bannerInfo = underscore.sortBy(banner, 'banner_ordem');

      let transicao = 2000;
      if (this.bannerInfo && this.bannerInfo[this.currentBannerIndex]) {
        transicao = this.bannerInfo[this.currentBannerIndex].tempo_transicao_seg * 1000;
      }
 
      const interval = setInterval(() => {
        this.currentBannerIndex++;
        if (this.currentBannerIndex >= this.bannerInfo.length) {
          this.currentBannerIndex = 0;
        }
      }, transicao);
    });
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
  }

  submittedChange() {
    this.submitted = false;
  }

  submittedChangeRecover() {
    this.submittedRecover = false;

  }

  onSubmitRecover() {
    this.submittedRecover = true;
    if (this.recoverForm.invalid) {
      return;
    }
  }

  openBanner(event, url) {
    if ($(event.target).attr('name') !== 'input_header_search' && url) {
      if ((url.split('://')).length == 1) {
        url = 'http://' + url;
      }
      window.open(url, '_blank');
    }
  }

  pesquisar(event) {

    if (event.charCode === 13) {
      const data = {
        search: event.target.value
      };

      if (data.search !== null) {
          this.subs.sink = this.cursosService.getCursos(data).subscribe((apiResponse) => {
          if (apiResponse !== undefined) {
            this.pesquisarService.changeCursos(apiResponse.items);
            this.router.navigate(['/pesquisar']);
          }
        });
      }
    }
  }


  onResized($event) {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    $(window).on('resize', function () {
      this.isMobile = (window.innerWidth < 992) ? true : false;
    });
  }

  setLoginAcessoRestrito() {
    this.loginStore.updateCurrentEndpoint({
      value: 'login',
      title: 'Acesso Restrito',
      endpoint: 'loginAcessoRestrito',
      hasCadastro: false
    });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  getPerfil(): number {
    return this.loginService.getPerfil();
  }

  checkBannerSize() {
    if (this.configuracoes.layoutHome == 4) {
      this.hasBanner = false;
      $('header').removeClass('background_header');
      $('header').css('cssText', 'height: unset !important;');
      $('header').css('cssText', 'min-height: unset !important;');
      $('header').css('cssText', 'margin-bottom: 0 !important;');
    }
    if (this.hasBanner) {
      console.log('route', this.route)
      if (this.route != 'home')
        this.bannerHeight = '500px';
      else
        this.bannerHeight = '800px'
    } else {
      this.bannerHeight = 'unset'
    }
   
  }

    logout() {
        this.loginService.logout();
        this.router.navigate(['/']);
    }
}
