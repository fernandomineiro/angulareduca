import { Component, OnInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '../../../security/login/login.service';

import { CursosService } from '../../../curso/cursos.service';
import { HeaderService } from 'src/app/header/header.service';

import * as Player from '@vimeo/player/dist/player.js';
import { DomSanitizer } from '@angular/platform-browser';

import { AlunoService } from 'src/app/aluno/aluno.service';
import * as _ from 'underscore';
import { environment } from 'src/environments/environment';
import { ConfiguracoesStore } from '../../../stores/configuracoes.store';
import {CursoTypes} from '../../../home/store/home.model';
import {LayoutTypes} from '../../../stores/layoutTypes';
import {Curso as CursoModelItv} from '../../../home/itv/store/itv.model';
import {TipoLiberacao} from '../../../curso/cursos-online/card-cursos-online/tipo-liberacao';
import {of} from 'rxjs';
import {Configuracao} from '../../../configuracao.model';

@Component({
  selector: 'mt-video',
  templateUrl: './video.component.html',
  styles: [`
    @media (max-width: 768px){
      #modulos_assistidos{
        position:unset !important;
      }
    }
  `]
})

export class VideoComponent implements OnInit, AfterContentInit {

  @ViewChild('video_container') videoContent: ElementRef;
  modulo: any;
  modulos: any;
  panelOpenState = [];
  assistidos: any;
  cursoId: any;
  curso: any;
  hasAccess: boolean;
  hasEnded = {
    ended: false
  };
  allModules = [];
  hasDownloaded = false;
  timeToNextModulo = {
    time: 5
  };
  interval = {
    value: null
  };
  timeout = {
    value: null
  };
  moduloLiberado = undefined;
  modulosComplete = false;
  public videoFlag = false;
  openWhere;
  lastVideo = { value: false };
  firstVideo = { value: false };
  IMG_URL = environment.img_url;

  src: any;

  reload = false;
  allAndAOVivo =  [];
  showLinkAoVivo;

  configuracoes: Configuracao;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private cursosService: CursosService,
    private headerService: HeaderService,
    private sanitizer: DomSanitizer,
    private alunoService: AlunoService,
    private configuracoesStore: ConfiguracoesStore,
  ) {

    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

  }
  cancelNextModulo() {
    clearTimeout(this.timeout.value);
  }

  finishModulo() {
    this.alunoService.setModuleComplete({
      'id_curso': this.cursoId,
      'fk_modulo': this.modulo[0].id,
      'fk_usuario': Number(localStorage.getItem('usuario_id'))
    }).subscribe(response => {
      if (response.success) {
        var found = _.findIndex(this.allAndAOVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) });
        found++;

        if (this.allAndAOVivo[found] != undefined)
          this.router.navigate(['/video/' + this.cursoId + '/' + this.allAndAOVivo[found].modulo_id]);
        else
          this.modulosComplete = true;
        if (this.curso.quiz_id == null)
          this.router.navigate(['/meu-curso/' + this.cursoId + '/faca-aulas']);
      }


    });
  }



  ngOnInit() {
    var newHasEnded = this.hasEnded;


    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
      const confNavColor =
        state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.headerService.selectedItem.next('user');

    this.cursoId = this.route.snapshot.params['idCurso'];


    this.cursosService.cursoById(this.cursoId)
      .subscribe((ApiResponse) => {
        this.curso = ApiResponse.data;
        this.checkIfUserHasCourse(this.cursoId);
      });

    this.cursosService.getModuloById(this.route.snapshot.params['idModulo'])
      .subscribe((ApiResponse) => {
        this.modulo = ApiResponse.data;
        this.modulo[0].isPodcast = false;
        if (this.modulo[0].url_video) {
          this.src = 'https://player.vimeo.com/video/' + this.modulo[0].url_video;
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src)
        } else if (this.modulo[0].url_arquivo && this.modulo[0].url_arquivo.includes('.mp3')) {
          this.modulo[0].isPodcast = true;
        }


        this.cursosService.modulosByCursoId(this.route.snapshot.params['idCurso'])
          .subscribe((ApiResponse) => {
            this.modulos = ApiResponse.items;
            this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(this.cursoId))
              .subscribe((ApiResponse) => {
                let allSemAoVivo = []
                console.log("modulos assistidos", this.modulo[0].id)
                this.assistidos = ApiResponse.items;

                let amountAoVivo = 0
                this.modulos.forEach((element, i) => {
                  amountAoVivo += _.where(element.modulos, { aula_ao_vivo: 1 }).length
                });

                this.modulos.forEach((element, i) => {
                  element.modulos.forEach((element2, i2) => {
                    element2.liberado = true;
                    if (this.assistidos.includes(element2.modulo_id)) {
                      element2.assistido = true;
                    }
                    if (!element2.aula_ao_vivo) {
                      allSemAoVivo.push(element2);
                    }
                    this.allAndAOVivo.push(element2)
                  });

                  element.amountWatched = _.where(element.modulos, { assistido: true }).length;
                  var found = _.findIndex(element.modulos, { modulo_id: Number(this.route.snapshot.params['idModulo']) })
                  if (found > -1)
                    this.openWhere = i;
                });
                if(allSemAoVivo[0])
                  allSemAoVivo[0].liberado = true;
                allSemAoVivo.forEach((el, i) => {
                  if (i > 0) {
                    if (!allSemAoVivo[i - 1].assistido) {
                      el.liberado = false;
                    }
                  }
                })
                this.allModules = allSemAoVivo;
                if (this.assistidos.includes(this.modulo[0].id)) {
                  this.moduloLiberado = true;
                }
                console.log("allsemaovivo", allSemAoVivo)
                let foundModule = _.findWhere(allSemAoVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) })
                this.moduloLiberado = foundModule ? foundModule.liberado : false;
                console.log(_.findWhere(allSemAoVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) }));
                var newSrc = this.src;
                setTimeout(() => {
                  var playerEl = document.querySelector('#vimeoIframe');
                  if (playerEl) {
                    var player = new Player(document.querySelector('#vimeoIframe'));
                    player.on('play', () => {
                    });

                    player.on('ended', () => {
                      this.marcarAssistido(this.route.snapshot.params['idModulo']);
                    });
                  }

                }, 500)

                if (_.where(this.allModules, { assistido: true }).length == (this.allModules as any).length)
                  this.modulosComplete = true;

                console.log("hasaccess", this.hasAccess, "moduloLiberado", this.moduloLiberado );
                console.log("this.modulo[0]", this.modulo[0])
                if(this.modulo[0].aula_ao_vivo){
                    this.cursosService.getHourFromServer().subscribe((response) => {
                      const resultado = (response as any).retorno;
                      if ((resultado.data == this.modulo[0].data_aula_ao_vivo && resultado.hora >= this.modulo[0].hora_aula_ao_vivo) || (resultado.data > this.modulo[0].data_aula_ao_vivo)) {
                        this.showLinkAoVivo = true;
                      }else{
                        this.showLinkAoVivo = false;
                      }
                      this.moduloLiberado = true;
                    })

                }

              })

          })

      }
      )

  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  checkIfUserHasCourse(cursoId) {
    if (this.curso.tipo == CursoTypes.HIBRIDO) {
      this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
            const cursosRemotos = ApiResponse.items;
            if (_.findWhere(cursosRemotos, { id: Number(cursoId) }) == undefined) {
              this.hasAccess = false;
            } else {
              this.hasAccess = true;
            }
        });
    } else if (this.curso.tipo == CursoTypes.ONLINE) {
      this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
            const cursosOnline = ApiResponse.items;
            if (this.configuracoes.layoutHome === LayoutTypes.LAYOUTESTRUTURACURRICULAR) {
              this.checkIfCourseIsUnlocked(cursosOnline);
            } else {
              if (_.findWhere(cursosOnline, { id: Number(cursoId) }) == undefined) {
                this.hasAccess = false;
              } else {
                this.hasAccess = true;
              }
            }
        });
    } else if (this.curso.tipo == CursoTypes.PRESENCIAL) {
      this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
            const cursosPresenciais = ApiResponse.items;
            if (_.findWhere(cursosPresenciais, { id: Number(cursoId) }) == undefined) {
              this.hasAccess = false;
            } else {
              this.hasAccess = true;
            }
        });
    }

    if (!this.isLoggedIn()) {
      this.hasAccess = false;
    } else {
      this.hasAccess = true;
    }
  }

  checkIfCourseIsUnlocked(cursosAluno) {
    const currentCourseCategory = this.curso.categorias[0];
    cursosAluno.forEach(structure => {
      structure.categorias.forEach(category => {
        if (category.id === currentCourseCategory.id) {
          this.cursosService.getCursoDetalhesEstruturaCurricular(
              this.curso.id,
              structure.id,
              category.id,
              localStorage.getItem('usuario_id')
          ).subscribe((detalhesCursoCorrente: CursoModelItv) => {
            this.hasAccess = TipoLiberacao.of(structure.tipo_liberacao)
                .liberacao
                .setCourseList(category.cursos)
                .isCursoLiberado(detalhesCursoCorrente);
          });
        }
      });
    });
  }

  goToNextVideo() {
    var found = _.findIndex(this.allAndAOVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) });
    found++;
    console.log("this.allAndAOVivo",this.allAndAOVivo,this.allAndAOVivo[found].modulo_id )
    if (this.allAndAOVivo[found] != undefined)
      this.router.navigate(['/video/' + this.cursoId + '/' + this.allAndAOVivo[found].modulo_id]);


  }

  concluirModulos() {
    this.router.navigate(['/meu-curso/' + this.cursoId + '/faca-aulas']);
  }

  goToPrevVideo() {
    clearTimeout(this.timeout.value);
    var found = _.findIndex(this.allAndAOVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) });
    found--;
    if (this.allAndAOVivo[found] != undefined) {
      this.router.navigate(['/video/' + this.cursoId + '/' + this.allAndAOVivo[found].modulo_id]);
    }

  }


  marcarAssistido = (moduloId) => {
    this.alunoService.setModuleComplete({
      'fk_modulo': moduloId,
      'fk_usuario': Number(localStorage.getItem('usuario_id')),
      'id_curso': this.cursoId
    }).subscribe(response => {
      this.hasEnded.ended = true;
      var found = _.findIndex(this.allAndAOVivo, { modulo_id: Number(this.route.snapshot.params['idModulo']) });
      found++;
      if (found == 1)
        this.firstVideo.value = true;
      if (this.allAndAOVivo[found] == undefined) {
        this.lastVideo.value = true;
      }
      if(this.modulo[0].aula_ao_vivo != 1){
        if (this.lastVideo.value) {
          this.concluirModulos();
        }
        this.timeout.value = setTimeout(() => {
          if (this.allAndAOVivo[found] != undefined)
            this.router.navigate(['/video/' + this.cursoId + '/' + this.allAndAOVivo[found].modulo_id]);

        }, this.timeToNextModulo.time * 1000);
        this.interval.value = setInterval(() => {
          if (this.timeToNextModulo.time > 0)
            this.timeToNextModulo.time--;
        }, 1000)
      }

    })


  }

  ngAfterContentInit() {
    if ((typeof (this.videoContent) != "undefined") && (this.videoFlag == true)) {
      var player = new Player(document.querySelector('iframe'));

      player.on('play', () => {
      });

      player.on('ended', () => {
        this.marcarAssistido(this.route.snapshot.params['idModulo']);
      });

      this.videoFlag = false;
    }
  }

  reloadParent() {
    this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(this.route.snapshot.params['idCurso']))
      .subscribe((apiResponseModulos) => {
        this.assistidos = apiResponseModulos.items;
        console.log('assistidos', apiResponseModulos);
        this.reload = true;
      });
  }


}
