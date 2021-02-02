import { Component, OnInit } from '@angular/core';
import { TutoriaService } from 'src/app/tutoria/tutoria.service';
import { TutoriaChat } from 'src/app/tutoria/tutoria-chat/tutoria-chat.model';
import { ActivatedRoute } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { NgModel } from '@angular/forms';
import { Input } from '@angular/core';
import {formatDate } from '@angular/common';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';

import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';


@Component({
  selector: 'app-tutoria-chat',
  templateUrl: './tutoria-chat.component.html',
  styleUrls: ['./tutoria-chat.component.css']
})
export class TutoriaChatComponent implements OnInit {

  tutoriaChat = undefined;
  IMG_URL = 'https://s3.us-east-1.amazonaws.com/educaz20/files/usuario/';

  @Input()
  newMessage: string = '' ;
  user: { };

  constructor(
      private tutoriaService: TutoriaService,
      private route: ActivatedRoute,
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) {
    PNotifyButtons; // Initiate the module. Important!
  }

  ngOnInit() {
    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.newMessage = '';

    try {

      this.tutoriaService.getChat(this.route.snapshot.params.id).subscribe((apiResponse) => {
        apiResponse.items.messages.forEach((item) => {
          this.processImage(item.user);
        });

        this.tutoriaChat = apiResponse.items;
      });

    } catch (error) {
      PNotify.error({ text: error });
    }
  }

  onEnter(value: string) {
    this.newMessage = value;

    const newMensagem = {
      resposta: this.newMessage,
      fk_pergunta: this.route.snapshot.params.id
    };

    this.tutoriaService.postMensagem(newMensagem).subscribe( (apiResponse) => {
      if (apiResponse.success == true) {
        PNotify.success({
          text: 'Mensagem enviada com sucesso!',
          delay:3000
        });
        let date = new Date();
        if (apiResponse.data.data_criacao) {
          date = new Date(apiResponse.data.data_criacao);
        }
        this.processImage( apiResponse.data.usuario);
        this.tutoriaChat.messages.unshift({
          type: 'my',
          sentDate: date.getDate().toString().padStart(2, '0') + '/' +
              (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear(),
          sentTime: date.getHours().toString().padStart(2, '0') + ':' +
              date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0'),
          content: apiResponse.data.resposta,
          user: apiResponse.data.usuario
        });
      } else {
        PNotify.error({
          text: 'Erro ao enviar sua mensagem!',
          delay:3000
        });
      }
    });
  }

  clear() {
    this.newMessage = '';
  }

  processImage(user) {

    const oImage = new Image();
    oImage.src = this.IMG_URL + user.foto;
    oImage.onload = () => {
      user.foto = oImage.src;
    };

    oImage.onerror = () => {
      user.foto = '../../../../assets/img/default-avatar.png';
    };
  }
}
