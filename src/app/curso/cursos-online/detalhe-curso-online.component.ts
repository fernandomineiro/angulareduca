import {Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Curso } from '../curso.model';
import { CursosService } from '../cursos.service';
import { CategoriasService } from '../../categorias/categorias.service';

import { of } from 'rxjs';
import { HeaderService } from 'src/app/header/header.service';

import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { environment } from 'src/environments/environment';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { LoginService } from 'src/app/security/login/login.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import {MeAviseModalService} from '../me-avise-modal.service';

import { ConfiguracoesStore} from '../../stores/configuracoes.store';
import { Configuracao} from '../../configuracao.model';
import { DomSanitizer } from '@angular/platform-browser';
import { TipoLiberacao } from './card-cursos-online/tipo-liberacao';
import { LayoutTypes } from '../../stores/layoutTypes';
import { SubSink } from 'subsink';

import { Curso as CursoModelItv } from 'src/app/home/itv/store/itv.model';

@Component({
    styles: [` 
    #mobile_navbar { background-color: #DBDADA !important; }
    .box-shadow.course-card{
      margin:5px;
    }
    @media (max-width:768px){
      .rightBox{
          justify-content: center;
      }
  }
  #price{
    font-weight:bold;
    font-size:21px;
  }
  :host /deep/ app-mt-logotipo img{
    max-width:90px !important;
  }
  #long_description .title1{
    font-size: 22px;
    font-family: encodeSansCondensed-Bold;  
    padding-top: 5px;
  }
    
  `],
    selector: 'mt-detalhe-curso-online',
    templateUrl: './detalhe-curso-online.component.html'
})

export class DetalheCursoOnlineComponent implements OnInit, OnDestroy {

  IMG_URL = environment.img_url;
  s3_url = environment.s3_url;
  cursos: any;
  curso: any;
  tags: any;
  modulos: any;
  comentarios: any;
  video: any;
  sidebarInfo: any;
  showAbout: boolean = false;
  visualizar: boolean = false;
  cartItemState = 'ready';
  favorites: any;
  hasAccess = of(false);
  cursoLiberado = of(true);
  allModules = [];
  percent = 0;
  cursosAluno: any;
  src: any;

  curso_id: any;
  tipo_curso_id: number = 1;
  
  assistidos;
  isMobile = false;
  dataInicioCurso: any;

  configuracoes: Configuracao;
  subs = new SubSink();

  @Input() cartItem: Curso;
  @Output() add = new EventEmitter();

  constructor(private cursosService: CursosService,
              private categoriasService: CategoriasService, 
              private route: ActivatedRoute,
              private router: Router,
              private shoppingCartService: ShoppingCartService,
              private headerService: HeaderService,
              private modalMeAvise: MeAviseModalService,
              private alunoService: AlunoService,
              private configuracoesStore: ConfiguracoesStore,
              private loginService: LoginService,
              private sanitizer: DomSanitizer
  ) {
      PNotifyButtons; // Initiate the module. Important!
      this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  ngOnInit() {    
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.headerService.selectedItem.next('cursos');
    this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
        const confNavColor =
                    state.configuracao.tiposCursosAtivos.header_secundario ?
                    state.configuracao.tiposCursosAtivos.header_secundario :
                    '#DBDADA';
        this.headerService.changeNavColor.next(confNavColor);
        if (state.configuracao.layoutHome == 4) {
          this.tipo_curso_id = 5;
        }
    });

    this.curso = JSON.parse(localStorage.getItem('visualizarCursoOnline'));

    if (this.route.snapshot.params['id'] != 0 && this.tipo_curso_id != 5) {
      this.visualizar = false;

      this.subs.sink = this.cursosService
                            .getCourseIDBySlug(this.route.snapshot.params['id'], this.tipo_curso_id)
                            .subscribe((ApiResponse) => {
        this.curso_id = ApiResponse.data['id'];

        this.subs.sink = this.cursosService
                          .cursoById(this.curso_id)
                          .subscribe((cursos) => {
            this.curso = cursos.data;
            this.curso.certificado = this.curso.certificado != 0 ? 'SIM' : 'NÃO';

            if (this.curso.teaser != null) {
              if (this.curso.teaser.includes('vimeo')) {
                this.curso.teaser = this.curso.teaser.split('/');
                this.curso.teaser = this.curso.teaser[this.curso.teaser.length - 1];
              }
              this.curso.teaser = 'https://player.vimeo.com/video/' + this.curso.teaser;
              this.curso.teaser = this.sanitizer.bypassSecurityTrustResourceUrl(this.curso.teaser);
            }

            this.showAbout = true;
            this.curso.isFavorite = this.cursosService.checkIfCourseIsFavorite(
                this.curso.id, localStorage.getItem('usuario_id'), this.favorites
            );
        });

        this.subs.sink = this.alunoService.getSidebarInfo(
            Number(this.curso_id),
            Number(localStorage.getItem('usuario_id'))
          ).subscribe((sidebarInfo) => {
            this.sidebarInfo = sidebarInfo.data;
            if (Number(localStorage.getItem('usuario_id')) > 0) {
                this.alunoService.tempo_finalizar.next(this.sidebarInfo.tempo_finalizar);
                this.subs.sink = this.alunoService.getProgressoConclusao(
                      Number(localStorage.getItem('usuario_id')),
                      Number(this.curso_id)
                    ).subscribe((progressoConclusaoResponse) => {
                        this.sidebarInfo.percent = progressoConclusaoResponse.percentual_conclusao * 100;
                    });
            }
          });

        this.subs.sink = this.cursosService
            .getFavorites(
                localStorage.getItem('usuario_id')
            ).subscribe(favorites => {
              this.favorites = favorites;
              this.subs.sink = this.cursosService
                .getCursosOnlinePorAluno(
                    localStorage.getItem('usuario_id')
                ).subscribe((cursosAluno) => {
                  this.cursosAluno = cursosAluno.items;
                  this.subs.sink = this.cursosService
                      .getCursosRecentes(1)
                      .subscribe((cursosRecentes) => {
                        this.cursos = cursosRecentes.items;
                  });

                  if (this.loginService.isLoggedIn()) {
                    this.checkIfHasCourse();
                  }
            });
        });
    
        this.cursosService.modulosByCursoId(this.curso_id).subscribe((modulos) => {
          this.modulos = modulos.items;
          this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(this.curso_id))
          .subscribe((modulosCompletos) => {
            this.assistidos = modulosCompletos.items;
            this.percent = modulosCompletos.progresso * 100;
          });
        });
      });
    }
  }

  inserirNoCarrinho(item) {
    const categoria = 'Curso Online';

    let total = 0;
    if (localStorage.getItem('carrinho') != null) {
        total = JSON.parse(localStorage.getItem('carrinho')).length;
    }

    const imagem = item.imagem == null ? '../assets/img/az.png' :  this.IMG_URL + '/files/curso/imagem/' + item.imagem;
    const valor = item.valor == null ? item.valor_de : item.valor;

    this.shoppingCartService.addItem(item.nome_curso, item.id, valor, imagem, categoria, item.gratis);
    if (localStorage.getItem('carrinho') != null && total < JSON.parse(localStorage.getItem('carrinho')).length) {
      PNotify.success({
        text: 'Item adicionado ao carrinho',
        delay: 3000
      });
    } else {
      PNotify.error({        
        text: 'Este item já está no carrinho.',
        delay: 3000
      });
    }
  }

  checkIfHasCourse() {
      this.setIfUserHasCourse(false);
      if (this.configuracoes.layoutHome === LayoutTypes.LAYOUTESTRUTURACURRICULAR) {
          this.setIfUserHasCourse(true);
          this.checkIfCourseIsUnlocked();
      } else {
          this.cursosAluno.forEach(element => {
              if (element.id == Number(this.curso_id)) {
                this.setIfUserHasCourse(true);
                this.dataInicioCurso = element.data_inicio;
              }
          });
      }
  }

  private setIfUserHasCourse(hasCourse: boolean) {
    this.hasAccess = of(hasCourse);
  }

  checkIfCourseIsUnlocked() {
      const currentCourseCategory = this.curso.categorias[0];

      this.cursosAluno.forEach(structure => {
          structure.categorias.forEach(category => {
              if (category.id === currentCourseCategory.id) {
                  this.subs.sink = this.cursosService.getCursoDetalhesEstruturaCurricular(
                      this.curso.id,
                      structure.id,
                      category.id,
                      localStorage.getItem('usuario_id')
                  ).subscribe((detalhesCursoCorrente: CursoModelItv) => {
                      const isUnlocked = TipoLiberacao.of(structure.tipo_liberacao)
                          .liberacao
                          .setCourseList(category.cursos)
                          .isCursoLiberado(detalhesCursoCorrente);
                      this.cursoLiberado = of(isUnlocked);
                  });
              }
          });
      });
  }

  favoritar(course) {
    let data = {
      fk_curso:course.id,
      fk_aluno: localStorage.getItem('usuario_id')
    }
    this.cursosService.recordAsFavorite(data,course.isFavorite.value).subscribe((apiResponse) => {     
      if(apiResponse.success){
        if(course.isFavorite.value)
          course.isFavorite = of(false);
        else
          course.isFavorite = of(true);
      }else{
        PNotify.error({        
          text: 'Houve um erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
      }
    }); 
       
  }
  openWarnMeModal(idCurso) {
      console.log(idCurso)
      localStorage.setItem('idCursoMeAvise', idCurso)
      this.modalMeAvise.openWarning();
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
  }

  get cargaHorariaTotal() {
    const horas = this.curso.duracao_total.split(':');   
    if( Number(horas[0]) == 0 && Number(horas[1] != 0))
      return Number(horas[1]) + ' minutos';
    else if(Number(horas[0]) == 0 && Number(horas[1] == 0))
      return '1 hora';
    return Number(horas[0]) + ' hora(s)';
  }
}
