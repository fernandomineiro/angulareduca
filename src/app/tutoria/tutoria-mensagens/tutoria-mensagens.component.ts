import { Component, OnInit } from '@angular/core';
import { TutoriaMensagens } from 'src/app/tutoria/tutoria-mensagens/tutoria-mensagens.model';
import { TutoriaService } from 'src/app/tutoria/tutoria.service';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-tutoria-mensagens',
  templateUrl: './tutoria-mensagens.component.html',
  styleUrls: ['./tutoria-mensagens.component.scss']
})
export class TutoriaMensagensComponent implements OnInit {

  constructor(private tutoriaService: TutoriaService, private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService) { }

  tutoriaMensagens: TutoriaMensagens[];
  IMG_URL = environment.img_url;
  selectedModalidade = null;
  selectedCurso = null;
  dataEnvio = null;
  cursos: any[];

  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.tutoriaService.getMensagens(null).subscribe((apiResponse) => {
        const resposta = apiResponse.items;
        this.tutoriaMensagens = resposta.perguntas;
        this.cursos = resposta.cursos;
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  sendMessage(data) {

  }
  sendPesquisa() {
      const data = {
          modalidade: this.selectedModalidade,
          curso: this.selectedCurso,
          dataEnvio: this.dataEnvio
      };
      console.log(data)
      try {

          this.tutoriaService.getMensagens(data).subscribe((apiResponse) => {
              const resposta = apiResponse.items;
              this.tutoriaMensagens = resposta.perguntas;
              this.cursos = resposta.cursos;
          });

      } catch (error) {
          console.log('==== error ====');
          console.log(error);
      }
  }

  verificaCursoLidas(mensagens, tooltip) {
      let lida = 1;
      lida = (mensagens.status == 2) ? 2 : lida;
      if (!tooltip) return this.lidas(lida, false);
      else {
          if (lida == 2) return 'Curso possui mensagens não-lidas';
          return 'Curso possui apenas mensagens lidas';
      }
  }

  lidas(mensagem, tooltip) {
      if (!tooltip) {
          if (mensagem == 2) return 'icon fas fa-envelope fa-2x';
          return 'icon fas fa-envelope-open fa-2x';
      } else {
          if (mensagem == 2) return 'Mensagem não-lida';
          return 'Mensagem lida';
      }
  }

}


