import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {MeAviseModalService} from 'src/app/curso/me-avise-modal.service';
import { CursosService } from 'src/app/curso/cursos.service';
import { Observable, from, of } from 'rxjs';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import { LoginService } from 'src/app/security/login/login.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import moment from 'moment';
import {Configuracao} from '../../../configuracao.model';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';

@Component({
  selector: 'app-card-cursos-presenciais',
  templateUrl: './card-cursos-presenciais.component.html',
  styleUrls: ['./card-cursos-presenciais.component.scss']
})
export class CardCursosPresenciaisComponent implements OnInit {

  configuracoes: Configuracao;

  cursoLiberado = false;

  constructor(private cursosService: CursosService,
              private shoppingCartService: ShoppingCartService,
              private loginService: LoginService,
              private modalMeAvise: MeAviseModalService,
              private modalWarning: ModalAvisoService,
              private configuracoesStore: ConfiguracoesStore
  ) {
      PNotifyButtons; // Initiate the module. Important!
      this.isMobile = (window.innerWidth < 992) ? true : false;
      this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
      });
   }

  IMG_URL = environment.img_url + '/files/curso/imagem/';
   isMobile = false;
  @Input()
  favorites: any;

  @Input()
  cursosAluno: any;

  @Input()
  curso: any;

  ngOnInit() {
    this.curso.imagem = this.curso.imagem != null ? this.curso.imagem.split('/') : this.curso.imagem; 
    this.curso.imagem = this.curso.imagem != null ? this.curso.imagem[this.curso.imagem.length-1] : this.curso.imagem;  
    this.curso.isFavorite = this.cursosService.checkIfCourseIsFavorite(
        this.curso.id, localStorage.getItem('usuario_id'), this.favorites
    );
    this.curso.bought = this.cursosService.checkIfCourseWasBought(
        this.curso.id, localStorage.getItem('usuario_id'), this.cursosAluno
    );

    /*const oImage = new Image();
    oImage.src = this.IMG_URL + this.curso.imagem;
    oImage.onload = () => {
      this.curso.imagem = oImage.src;
    };

    oImage.onerror = () => {
      this.curso.imagem = '../../../../assets/img/az.png';
      return false;
    };*/

    const dataInicio = moment(this.curso.data_inicio);

    if (dataInicio.diff(moment(), 'minutes') <= 0) {
      this.cursoLiberado = true;
      console.log('Curso está liberado');
    }

    if (this.configuracoes.layoutHome != 1) {
      this.cursoLiberado = true;
    }
  }

  favoritar(course) {
    if (!this.loginService.isLoggedIn()) {
      this.modalWarning.openWarning('Você deve estar logado para Favoritar um curso');
      console.log('entrei');
      return;
    }
    const data = {
      fk_curso: course.id,
      fk_aluno: localStorage.getItem('usuario_id')
    };
    this.cursosService.recordAsFavorite(data, course.isFavorite.value).subscribe((apiResponse) => {
      if (apiResponse.success) {
        course.isFavorite =  course.isFavorite.value ? of(false) : of(true);    
      } else {
        PNotify.error({        
          text: 'Houve um erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
      }
    }); 
       
  }

  addToCart(item,image) {
    const valor = item.valor == null ? item.valor_de : item.valor;
    this.shoppingCartService.addItem(item.titulo, item.id, valor, image.src , 'Curso Presencial',item.gratis);

  }

  openWarnMeModal(idCurso) {
      console.log(idCurso);
      localStorage.setItem('idCursoMeAvise', idCurso);
      this.modalMeAvise.openWarning();
  }

  onResized($event): void{
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  // @ts-ignore
  get dataInicio() {
    const dataInicio = moment(this.curso.data_inicio);
    return dataInicio.format('DD/MM/YYYY');
  }
}
