import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MeAviseModalService} from 'src/app/curso/me-avise-modal.service';
import { CursosService } from 'src/app/curso/cursos.service';
import { of } from 'rxjs';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import { LoginService } from 'src/app/security/login/login.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import { FormBuilder } from '@angular/forms';
import { ConfiguracoesStore } from '../../../stores/configuracoes.store';
import { Configuracao } from '../../../configuracao.model';
import moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../index.reducers';
import { isCourseBought } from '../../../security/login/store/login.selector';
import {GeneratedTipoLiberacao, TipoLiberacao} from './tipo-liberacao';
import {CursoLiberacaoAbstract} from './curso-liberacao.abstract';

// @ts-ignore
import $ from 'jquery';
import {LayoutTypes} from '../../../stores/layoutTypes';
// @ts-ignore
declare var $: $;

@Component({
  selector: 'app-card-cursos-online',
  templateUrl: './card-cursos-online.component.html',
  styleUrls: ['./card-cursos-online.component.scss']
})
export class CardCursosOnlineComponent implements OnInit {

    imagem;
    configuracoes: Configuracao;

    isMobile = false;
    isFavorite;
    cursoLiberado = true;
    bought = of(false);
    currentCourseIndex;

    IMG_URL = environment.img_url + '/files/curso/imagem/';

    @Input()
    favorites: any;

    @Input()
    cursosAluno;

    @Input()
    curso: any;

    @Input()
    tipoLiberacao;

    defaultImg = '../../../../assets/img/az.png';

  constructor(
      private cursosService: CursosService,
      private shoppingCartService: ShoppingCartService,
      private loginService: LoginService,
      private modalWarning: ModalAvisoService,
      private modalMeAvise: MeAviseModalService,
      private formBuilder: FormBuilder,
      private configuracoesStore: ConfiguracoesStore,
      private store: Store<AppState>
  ) {
    // tslint:disable-next-line:no-unused-expression
    PNotifyButtons; // Initiate the module. Important!
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
    });
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  ngOnInit() {

        this.cursoLiberado = true;
        const image = this.curso.imagem != null ? this.curso.imagem.split('/') : this.curso.imagem;
        this.imagem = image != null ? image[image.length - 1] : this.curso.imagem;

        this.isFavorite = this.cursosService.checkIfCourseIsFavorite(
            this.curso.id, localStorage.getItem('usuario_id'), this.favorites
        );

        this.bought = this.store.select(isCourseBought, { idCourse: this.curso.id });
        if (this.loginService.isLoggedIn()) {

            if (this.configuracoes.layoutHome === LayoutTypes.LAYOUTESTRUTURACURRICULAR) {
                this.bought = of(true);
                this.currentCourseIndex = this.cursosAluno.findIndex(curso => {
                    return curso.id === this.curso.id;
                });

                if (!this.tipoLiberacao) {
                    this.tipoLiberacao = GeneratedTipoLiberacao.LIVRE;
                }

                this.cursoLiberado = TipoLiberacao.of(this.tipoLiberacao)
                                            .liberacao
                                            .setCourseList(this.cursosAluno)
                                            .isCursoLiberado(this.curso);
            }
        }
  }

  favoritar(course) {
    if (!this.loginService.isLoggedIn()) {
      this.modalWarning.openWarning('Você deve estar logado para Favoritar um curso');
      return;
    }
    const data = {
      fk_curso: course.id,
      fk_aluno: localStorage.getItem('usuario_id')
    };
    this.cursosService.recordAsFavorite(data, this.isFavorite.value).subscribe((apiResponse) => {
      if (apiResponse.success) {
        this.isFavorite =  this.isFavorite.value ? of(false) : of(true);              
      } else {
        PNotify.error({        
          text: 'Houve um erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
      }
    });
  }

  addToCart(item, image) {
    console.log(image)
    const valor = item.valor == null ? item.valor_de : item.valor;
    this.shoppingCartService.addItem(item.titulo, item.id, valor, image.src , 'Curso Online', item.gratis);
  }

  openWarnMeModal(idCurso) {
    console.log(idCurso);
    localStorage.setItem('idCursoMeAvise', idCurso);
    this.modalMeAvise.openWarning();
  }

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  // @ts-ignore
  get dataInicio() {
    const dataInicio = moment(this.curso.data_inicio);
    return dataInicio.format('DD/MM/YYYY');
  }

}
