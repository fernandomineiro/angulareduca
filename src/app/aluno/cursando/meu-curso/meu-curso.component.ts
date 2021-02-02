import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../../curso/cursos.service'
import { HeaderService } from 'src/app/header/header.service'
import { ActivatedRoute } from '@angular/router';
import { AlunoService } from 'src/app/aluno/aluno.service';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: #DBDADA !important; }
    @media (max-width:767px){
      #page-conta .user-info{
        border:none !important;
      }
    }
   
  `],
  selector: 'mt-meu-curso',
  templateUrl: './meu-curso.component.html'
})

export class MeuCursoComponent implements OnInit {

  cursoId;
    // tslint:disable-next-line:variable-name
  tempo_finalizar;
    // tslint:disable-next-line:variable-name
  progresso_conclusao;
    // tslint:disable-next-line:variable-name
  situacao_questionario;
    // tslint:disable-next-line:variable-name
  situacao_online;
    // tslint:disable-next-line:variable-name
  situacao_presencial;
    // tslint:disable-next-line:variable-name
  exibir_pendencias;

  constructor(
      private headerService: HeaderService,
      private route: ActivatedRoute,
      private alunoService: AlunoService,
      private configuracoesStore: ConfiguracoesStore,
  ) {

  }

  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.cursoId = this.route.snapshot.root.firstChild.params.id;
    this.alunoService.tempo_finalizar.subscribe((item) => {
        this.tempo_finalizar = item;
        if (!this.tempo_finalizar ) {
            this.tempo_finalizar = 100000000;
        }
    });

    // inserir serviço de situacao conclusao para exibir ao enviar trabalho
    this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')), Number(this.cursoId))
      .subscribe((item) => {
        this.progresso_conclusao = item;

        this.situacao_questionario = !this.progresso_conclusao.aprovacao_questionario;
        this.situacao_presencial = (this.progresso_conclusao.numero_aulas_presencial != 0 
                                && this.progresso_conclusao.percentualPresencial != 100);
        this.situacao_online = (this.progresso_conclusao.numero_aulas_online != 0 
                                && this.progresso_conclusao.percentualOnline != 100);
        this.exibir_pendencias = this.situacao_questionario || this.situacao_online || this.situacao_presencial;
    });
    
  }
}
