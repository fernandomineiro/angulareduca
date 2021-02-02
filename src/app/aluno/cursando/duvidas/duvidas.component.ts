import { Component, OnInit, Input } from '@angular/core';
import $ from 'jquery';
import { HeaderService } from 'src/app/header/header.service';
import { ActivatedRoute } from '@angular/router';
import { AlunoService } from '../../aluno.service';
import { TutoriaService } from '../../../tutoria/tutoria.service';

import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';

import { LoginService } from '../../../security/login/login.service';

@Component({
  selector: 'app-duvidas',
  templateUrl: './duvidas.component.html',
  styleUrls: ['./duvidas.component.css']
})
export class DuvidasComponent implements OnInit {

    IMG_URL = 'https://s3.us-east-1.amazonaws.com/educaz20/files/usuario/';

    constructor(
        private alunoService: AlunoService,
        private tutoriaService: TutoriaService,
        private route: ActivatedRoute,
        private loginService: LoginService
    ) {
      PNotifyButtons; // Initiate the module. Important!
    }

    @Input()
    newMessage: string = '' ;
    user: { };
    duvidas = undefined;

    ngOnInit() {

      this.newMessage = '';

      this.user = this.loginService.user;
      this.alunoService.getDuvidas(this.route.parent.snapshot.params.id, Number(localStorage.getItem('usuario_id'))).subscribe((duvidas) => {
        duvidas.items.messages.forEach((item) => {
            this.processImage(item.user);
        });

        this.duvidas = duvidas.items;
      });
    }

    onEnter(value: string) {
      this.newMessage = value;

      // Olá estou com algumas dúvidas sobre o upload de TCC, poderia me auxiliar.

      const newMensagem = {
        resposta: this.newMessage,
        fk_pergunta: this.duvidas.id_pergunta
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
            this.duvidas.messages.unshift({
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
