import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Curso } from '../curso.model';
import { CursosService } from '../cursos.service';

import { Categoria } from '../../categorias/categorias.model';
import { CategoriasService } from '../../categorias/categorias.service';

import { Observable, from, of } from 'rxjs';
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { HeaderService } from 'src/app/header/header.service';

import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/security/login/login.service';
import * as underscore from 'underscore';
import { AlunoService } from 'src/app/aluno/aluno.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import moment from 'moment';
import { AgmMap, MapsAPILoader} from '@agm/core';
import {MeAviseModalService} from '../me-avise-modal.service';
import {parseIntAutoRadix} from '@angular/common/src/i18n/format_number';
import { DomSanitizer } from '@angular/platform-browser';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

declare var google: any;

@Component({
  styles: [`
    #mobile_navbar { background-color: #DBDADA !important; }
    #infos div,
    #course_company{
      font-family:'encodeSansCondensed-Regular';
    }
    #infos div{
      display:flex;
    }
  `],
  selector: 'mt-detalhe-curso-presencial',
  templateUrl: './detalhe-curso-presencial.component.html'
})
export class DetalheCursoPresencialComponent implements OnInit {
  IMG_URL = environment.img_url;
  s3_url = environment.s3_url;
  curso: any;
  categorias: any;
  tags: any;
  cursos: any;
  modulos: any;
  panelOpenState = [];
  favorites: any;
  sidebarInfo: any;
  assistidos;
  hasAccess;
  visualizar = false;
  allModules = [];
  cursosAluno: any;
  slide1Config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay:true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false
        }
      },
      {
        breakpoint: 784,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      {
        breakpoint: 478,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  };

  // google maps zoom level
  zoom: number = 15;

  // initial center position for the map
  lat: number;
  lng: number;
  geocoder: any;
  src: any;

  curso_id: string;
  tipo_curso_id: number = 2;

  constructor(
    private cursosService: CursosService,
    private categoriasService: CategoriasService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private alunoService: AlunoService,
    private modalMeAvise: MeAviseModalService,
    public mapsApiLoader: MapsAPILoader,
    private sanitizer: DomSanitizer,
    private configuracoesStore: ConfiguracoesStore,
  ) {
    // tslint:disable-next-line:no-unused-expression
    PNotifyButtons; // Initiate the module. Important!
  }


  @ViewChild(AgmMap) public map: AgmMap;

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    const that = this;

    let newAllModules;
    this.headerService.selectedItem.next('cursos');

      this.configuracoesStore.state$.subscribe(state => {
          const confNavColor =
              state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
          this.headerService.changeNavColor.next(confNavColor);
      });

      this.curso = JSON.parse(localStorage.getItem('visualizarCursoPresencial'));
      if (this.route.snapshot.params['id'] != 0) {
          this.visualizar = false;

          this.cursosService.getCourseIDBySlug(this.route.snapshot.params['id'], this.tipo_curso_id).subscribe((ApiResponse) => {
            this.curso_id = ApiResponse.data['id'];
          
            this.alunoService.getSidebarInfo(
              Number(this.curso_id),
              Number(localStorage.getItem('usuario_id'))
              ).subscribe((sidebarInfo) => {
                this.sidebarInfo = sidebarInfo.data;
                this.alunoService.tempo_finalizar.next(this.sidebarInfo.tempo_finalizar);
                this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')), Number(this.curso_id))
                  .subscribe((ApiResponse) => {
                      this.sidebarInfo.percent = ApiResponse.percentual_conclusao*100;
                      // console.log("sidebar percent", this.sidebarInfo.percent);
                  });
            });

            this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
              this.favorites = favorites;
              this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
                  this.cursosAluno = cursosAluno.items;
                  this.cursosService.getCursosRecentes(2).subscribe((ApiResponse) => {
                      this.cursos = ApiResponse.items;

                  });
              });
              this.cursosService.cursoById(this.curso_id)
                  .subscribe((ApiResponse) => {
                      this.curso = ApiResponse.data;
                      if(this.curso.teaser != null){
                        if(this.curso.teaser.includes('vimeo')){
                          this.curso.teaser = this.curso.teaser.split('/');
                          this.curso.teaser = this.curso.teaser[this.curso.teaser.length-1]
                        } 
                        this.curso.teaser = 'https://player.vimeo.com/video/' + this.curso.teaser;       
                        this.curso.teaser= this.sanitizer.bypassSecurityTrustResourceUrl(this.curso.teaser) 
                      }
                     
                      this.mapsApiLoader.load().then(() => {
                          this.geocoder = new google.maps.Geocoder();
                          this.geocoder.geocode({
                              address: this.curso.endereco_presencial
                          }, (results, status) => {
                              if (status === 'OK') {
                                  if (results[0].geometry.location) {
                                      that.lat = results[0].geometry.location.lat();
                                      that.lng = results[0].geometry.location.lng();
                                  }
                              }
                          });
                      });

                      this.curso.isFavorite =
                          this.cursosService.checkIfCourseIsFavorite(this.curso.id, localStorage.getItem('usuario_id'), this.favorites);
                      if (this.loginService.isLoggedIn()) {
                          this.checkIfHasCourse();
                      }
                  });
            });

            this.cursosService.agendasByCursoId(this.curso_id).subscribe((ApiResponse) => {
              this.modulos = ApiResponse.items;
              this.modulos.forEach(element => {
                  this.panelOpenState.push(false);
              });
              this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(this.curso_id))
                .subscribe((ApiResponse) => {
                  this.assistidos = ApiResponse.items;
                  this.modulos.forEach((element, i) => {
                    element.modulos.forEach((element2, i2) => {
                      this.allModules.push(element2);
                      if (this.assistidos.includes(element2.modulo_id.toString()))
                          element2.assistido = true;
                    });
                    element.amountWatched = underscore.where(element.modulos, {assistido: true}).length;
                  });
                  newAllModules = this.allModules;
              });
            });

            this.cursosService.tagsByCursoId(this.curso_id)
              .subscribe((ApiResponse) => {
                this.tags = ApiResponse.items;
              }
            );

          });
          
      } else {
          this.visualizar = true;
          this.modulos = this.curso.modulos.map(e => {
              return {
                  data_inicio: e.data_inicio,
                  descricao_agenda: e.descricao_agenda,
                  hora_inicio: e.hora_inicio,
                  hora_final: (e.hora_fim) ? e.hora_fim : e.hora_final
              };
          });
      }
  }

  inserirNoCarrinho(item) {  

    const categoria = 'Curso Presencial';
    let total = 0;

    if (localStorage.getItem('carrinho') != null) {
      total = JSON.parse(localStorage.getItem('carrinho')).length;
    }
    var imagem = item.imagem == null ? '../assets/img/az.png' :  this.IMG_URL+'/files/curso/imagem/'+item.imagem;
    var valor = item.valor == null ? item.valor_de : item.valor;
    this.shoppingCartService.addItem(item.nome_curso, item.id, valor,imagem, categoria,item.gratis);
    if (localStorage.getItem('carrinho') != null && total < JSON.parse(localStorage.getItem('carrinho')).length) {
      PNotify.success({
        text: 'Item adicionado ao carrinho'
      });
    } else {
      PNotify.error({        
        text: 'Este item já está no carrinho.'
      });
    }
  }

  checkIfHasCourse() {

    this.hasAccess = false;
    this.cursosService
        .getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
            const cursosRemotos = ApiResponse.items;
            cursosRemotos.forEach(element => {
              if (element.id == Number(this.curso_id) ) {
                this.hasAccess = true;
              }
            });
        });
  }

  favoritar(course) {
    const data = {
      fk_curso: course.id,
      fk_aluno: localStorage.getItem('usuario_id')
    }
    this.cursosService.recordAsFavorite(data, course.isFavorite.value).subscribe((apiResponse) => {
      if (apiResponse.success) {
        course.isFavorite = of(true);
        if (course.isFavorite.value) {
          course.isFavorite = of(false);
        }
      } else {
        PNotify.error({        
          text: 'Houve um erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
      }
    });
  }

  get cargaHorariaTotal() {

    //return 0;

    /*
    calculo removido em devido dao uso da carga horária total já presente em curso (ED2-1442)
    const resetedTime = moment().startOf('day');

    const time = moment().startOf('day');
    this.modulos.forEach((module) => {

      const startTime = moment(module.hora_inicio , 'HH:mm:ss');
      const endTime = moment(module.hora_final, 'HH:mm:ss');

      const duration = moment.duration(endTime.diff(startTime));

      time.add(duration.asHours(), 'hours');
    });

    const ms = time.diff(resetedTime);
    const d = moment.duration(ms);
    const minutos = moment.utc(ms).format('mm');
    if (parseInt(minutos) > 0) {
        // console.log(d.asHours())
        return (Math.floor(d.asHours()) + 1);
    }
    // return Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
    return Math.floor(d.asHours());*/

    const horas = this.curso.duracao_total.split(':');
    return parseInt(horas[0]);
  }

  get moduloInicialFinal(){
    // console.log(this.modulos);
    let primeiroModulo = this.modulos[0];
    if(this.modulos.length>1){
      let ultimoModulo = this.modulos[this.modulos.length - 1];
      // console.log([primeiroModulo, ultimoModulo]);
      return [primeiroModulo, ultimoModulo];
    } else {
      //console.log([primeiroModulo]);
      return [primeiroModulo];      
    }
  }

  openWarnMeModal(idCurso) {
      //console.log(idCurso)
      localStorage.setItem('idCursoMeAvise', idCurso)
      this.modalMeAvise.openWarning();
  }
}
