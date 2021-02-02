import { Component, OnDestroy, OnInit} from '@angular/core';
import { CursosService } from '../curso/cursos.service';
import { CategoriasService } from '../categorias/categorias.service';
import { HeaderService } from 'src/app/header/header.service';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';

import { CategoriaStore } from '../stores/categoria.store';

import { environment } from '../../environments/environment';
import { LoginService } from '../security/login/login.service';
import { ConfiguracoesStore } from '../stores/configuracoes.store';
import * as _ from 'underscore';
import $ from 'jquery';
import { FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { AppState } from '../index.reducers';
import { Store } from '@ngrx/store';
import { login, meusCursosOnline } from '../security/login/store/login.selector';
import { LoginModel } from '../security/login/store/login.model';
import { MeusCursosLoad } from '../security/login/store/login.actions';
import {LoadTrilhas} from './store/home.actions';
import {trilhas} from './store/home.selector';
import {CursoTypes} from './store/home.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  IMG_URL = environment.img_url;
  API_URL = environment.api;
  // tslint:disable-next-line:variable-name
  cursos_recentes: any[];
  // tslint:disable-next-line:variable-name
  cursos_promocoes: any[];
  // tslint:disable-next-line:variable-name
  cursos_presenciais: any[];
  categorias: any[];
  trilha: any[];
  home: any;
  favorites: any;
  cursosAluno: any;
  cursosAluno$;
  cursosAlunoPresencial: any;
  trilhas: any;
  trilhaFavorites: any;
  cursosAlunoRemoto: any;
  // tslint:disable-next-line:variable-name
  cursos_remotos: any;
  total_tipos = 0;
  environmentTemplate = environment;

  configuracoes: any;

  offsetLeftContainer;
  widthContainer;
  isMobile = false;

  cursosLayout2;

  cursosLayout3 = {
    cursosOnline: undefined,
    cursosPresenciais: undefined,
    cursosRemotos: undefined
  }

  layout3NoCourses = false;
  changePageForm;
  bannerSecundario;
  bannerSecundarioUrl;
  src = 'https://player.vimeo.com/video/';

  subs = new SubSink();

  constructor(
    private cursosService: CursosService,
    private categoriasService: CategoriasService,
    private headerService: HeaderService,
    private trilhasService: TrilhasService,
    private categoriaStore: CategoriaStore,
    private loginService: LoginService,
    private configuracoesStore: ConfiguracoesStore,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {

    var interval = setInterval(() => {
      if ($('#web_navbar .container').offset() != undefined) {
        this.offsetLeftContainer = $('#web_navbar .container').offset().left;
        this.widthContainer = $('#web_navbar .container').width();        
        clearInterval(interval)
      }     
    })

    this.isMobile = (window.innerWidth < 992) ? true : false;
    this.changePageForm = this.formBuilder.group({
      pageNumber: 1
    });
  }


  ngOnInit() {

    this.headerService.selectedItem.next('');
    this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;

      const confNavColor =
        state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });

    if (this.configuracoes.layoutHome == 1 || this.configuracoes.layoutHome == 4) {
      return;
    }

    this.subs.sink = this.headerService.getBanner(environment.faculdade_id, 'home').subscribe((ApiResponse) => {
        this.headerService.changeBanner.next(ApiResponse.items);
    });

    if (this.configuracoes.tiposCursosAtivos.ativar_banner_secundario) {
      this.subs.sink = this.headerService.getBannerSecundario(environment.faculdade_id).subscribe((apiResponse) => {
        this.bannerSecundario = apiResponse.items;

        if (apiResponse.items.tipo_banner == 2) {
          this.bannerSecundarioUrl = this.API_URL + '/files/banners/' + apiResponse.items.banner_url;
        }

      });
    }

    this.subs.sink = this.store.select(login).subscribe((state: LoginModel) => {

      if (state.loggedIn == 'true') {

          if (!state.meusCursos.isLoaded) {
            this.store.dispatch(new MeusCursosLoad());
          }

          this.subs.sink = this.trilhasService.getFavorites(this.loginService.user.id).subscribe(favorites => {
              this.trilhaFavorites = { items: Object.values(favorites.items) };
          });

          this.subs.sink = this.cursosService.getCursosPresenciaisPorAluno(this.loginService.user.id).subscribe((cursosAlunoPresencial) => {
              this.cursosAlunoPresencial = cursosAlunoPresencial.items;
          });

          this.subs.sink = this.cursosService.getFavorites(this.loginService.user.id).subscribe(favorites => {
              this.favorites = favorites;
          });

          this.subs.sink = this.cursosService.getCursosRemotosPorAluno(this.loginService.user.id).subscribe((cursosAlunoRemoto) => {
              this.cursosAlunoRemoto = cursosAlunoRemoto.items;
          });
      }

      this.cursosAluno$ = this.store.select(meusCursosOnline);
    });

    if (this.configuracoes.layoutHome == 0) {
      this._iniTipos();

      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_hibridos == 1) {
        this.subs.sink = this.cursosService.getCursosRecentes(4).subscribe((ApiResponse) => {
          this.cursos_remotos = ApiResponse.items;

          var chunked;
          if (this.total_tipos <= 2) {
            chunked = _.chunk(_.shuffle(this.cursos_remotos), this.cursos_remotos.length >= 4 ? this.cursos_remotos.length / 4 : 1);
            if (chunked[0].length > 4)
              this.cursos_remotos = chunked
            else
              this.cursos_remotos = _.chunk(_.shuffle(this.cursos_remotos), this.cursos_remotos.length);
          } else {
            chunked = _.chunk(_.shuffle(this.cursos_remotos), this.cursos_remotos.length >= 2 ? this.cursos_remotos.length / 2 : 1);
            if (chunked[0].length > 2)
              this.cursos_remotos = chunked
            else
              this.cursos_remotos = _.chunk(_.shuffle(this.cursos_remotos), this.cursos_remotos.length);
          }

        });
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_online == 1) {
        this.subs.sink = this.cursosService.getCursosRecentes(1).subscribe((ApiResponse) => {
          this.cursos_recentes = ApiResponse.items;

          let chunked;
          if (this.total_tipos <= 2) {
            chunked = _.chunk(this.cursos_recentes, this.cursos_recentes.length >= 4 ?  this.cursos_recentes.length / 4 : 1);
            if (chunked[0].length > 4) {
                this.cursos_recentes = chunked;
            } else {
                this.cursos_recentes = _.chunk(this.cursos_recentes, this.cursos_recentes.length);
            }
          } else {
            chunked = _.chunk(this.cursos_recentes, this.cursos_recentes.length >= 2 ?  this.cursos_recentes.length / 2 : 1);
            if (chunked[0].length > 2) {
                this.cursos_recentes = chunked;
            } else {
                this.cursos_recentes = _.chunk(this.cursos_recentes, this.cursos_recentes.length);
            }
          }
        });
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_trilha_conhecimento == 1) {
        this.subs.sink = this.trilhasService.getTrilhasHome().subscribe((trilha) => {
          this.trilhas = trilha.items;
        });
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_presenciais == 1) {
        this.subs.sink = this.cursosService.getCursosRecentes(2).subscribe((ApiResponse) => {
          this.cursos_presenciais = ApiResponse.items;

          var chunked;
          if (this.total_tipos <= 2) {
            chunked = _.chunk(_.shuffle(this.cursos_presenciais), this.cursos_presenciais.length >= 4 ? this.cursos_presenciais.length / 4 : 1);
            if (chunked[0].length > 4)
              this.cursos_presenciais = chunked
            else
              this.cursos_presenciais = _.chunk(_.shuffle(this.cursos_presenciais), this.cursos_presenciais.length);
          } else {
            chunked = _.chunk(_.shuffle(this.cursos_presenciais), this.cursos_presenciais.length >= 2 ? this.cursos_presenciais.length / 2 : 1);
            if (chunked[0].length > 2)
              this.cursos_presenciais = chunked
            else
              this.cursos_presenciais = _.chunk(_.shuffle(this.cursos_presenciais), this.cursos_presenciais.length);
          }
        });
      }

      this.subs.sink = this.cursosService.getCursosEmPromocao().subscribe((ApiResponse) => {
        this.cursos_promocoes = ApiResponse.items;

        let chunked;
        if (this.total_tipos <= 2) {

          chunked = _.chunk(this.cursos_promocoes, this.cursos_promocoes.length >= 4 ?  this.cursos_promocoes.length / 4 : 1);
          if (chunked[0].length > 4) {
              this.cursos_promocoes = chunked;
          } else {
              this.cursos_promocoes = _.chunk(this.cursos_promocoes, this.cursos_promocoes.length);
          }
        } else {
          chunked = _.chunk(this.cursos_promocoes, this.cursos_promocoes.length >= 2 ?  this.cursos_promocoes.length / 2 : 1);
          if (chunked[0].length > 2) {
              this.cursos_promocoes = chunked;
          } else {
              this.cursos_promocoes = _.chunk(this.cursos_promocoes, this.cursos_promocoes.length);
          }
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_trilha_conhecimento == 1) {
          this.subs.sink = this.trilhasService.getTrilhasHome().subscribe((trilha) => {
            this.trilhas = trilha.items;
          });
        }

      });
    } else if (this.configuracoes.layoutHome == 2) {
      // modelo por categoria
      this.subs.sink = this.cursosService.getCursosLayout2Home().subscribe((data) => {
        this.cursosLayout2 = data;
      });
    } else if (this.configuracoes.layoutHome == 3) {
      this.getCursosLayout3();
    }

    this.subs.sink = this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
      this.categoriaStore.updateCategorias(ApiResponse.items);
    });

    this.subs.sink = this.categoriaStore.state$.subscribe(state => {
        this.categorias = state.categorias;
    });

    this.home = true;

  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  _iniTipos() {
      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_hibridos == 1) {
          this.total_tipos++;
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_online == 1) {
          this.total_tipos++;
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_trilha_conhecimento == 1) {
          this.total_tipos++;
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_cursos_presenciais == 1) {
          this.total_tipos++;
      }

      if (this.configuracoes.tiposCursosAtivos.ativar_membership == 1) {
          this.total_tipos++;
      }
  }

  _chunkCursos(courses) {
      let chunked;
      let quantidadeCursos = 2;

      if (this.total_tipos <= 2) {
        quantidadeCursos = 4;
      }

      chunked = _.chunk(courses, courses.length >= quantidadeCursos ? courses.length / quantidadeCursos : 1);
      if (chunked[0].length < quantidadeCursos) {
          chunked = _.chunk(courses, courses.length);
      }

      return chunked;
  }

  returnSlideConfig(element, cardWidth) {
      return {
          centerMode: false,
          slidesToShow: Math.floor(($(element).width() / cardWidth)),
          slidesToScroll: Math.floor(($(element).width() / cardWidth)),
          autoplay: true,
          infinite: false,
      };
  }

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    if ($('#web_navbar .container').offset() != undefined)
      this.offsetLeftContainer = $('#web_navbar .container').offset().left;
    this.widthContainer = $('#web_navbar .container').width();
  }

  findCursos(filtro) {
    this.subs.sink = this.cursosService.getCursosLayout2Home(filtro).subscribe((data) => {
      this.cursosLayout2 = data;
    });
  }

  changePage() {
    this.getCursosLayout3();
  }

  prevPage() {
    let page = this.changePageForm.get('pageNumber').value;
    page--;
    this.changePageForm.controls['pageNumber'].setValue(page);
    this.getCursosLayout3();
  }

  nextPage() {
    let page = this.changePageForm.get('pageNumber').value;
    page++;
    this.changePageForm.controls['pageNumber'].setValue(page);
    this.getCursosLayout3();
  }


  getCursosLayout3() {
    let page = Number(this.changePageForm.get('pageNumber').value);
    var interval = setInterval(() => {
      if ($("#calculateWidth").length) {
        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_hibridos == 1) {
          let qtdCursos = (Math.floor($("#calculateWidth").eq(0).width() / 325)) * 5;
          this.subs.sink = this.cursosService.getCursosLayout3Home(4, qtdCursos, page).subscribe((data) => {
            this.cursosLayout3.cursosRemotos = data;
          })
        }
        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_online == 1) {
          let qtdCursos = (Math.floor($("#calculateWidth").eq(0).width() / 215)) * 5;
          this.subs.sink = this.cursosService.getCursosLayout3Home(1, qtdCursos, page).subscribe((data) => {
            this.cursosLayout3.cursosOnline = data;
          })
        }
        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_presenciais == 1) {
          let qtdCursos = (Math.floor($("#calculateWidth").eq(0).width() / 325)) * 5;
          this.subs.sink = this.cursosService.getCursosLayout3Home(2, qtdCursos, page).subscribe((data) => {
            this.cursosLayout3.cursosPresenciais = data;
          })
        }
      }
      clearInterval(interval)
    }, 200)

  }

  shouldShow(el) {
    let sizeEl = $("#calculateWidth div").length;
    return sizeEl <= 3
  }


}
