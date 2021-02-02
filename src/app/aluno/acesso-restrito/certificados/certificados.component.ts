import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {AlunoService} from '../../aluno.service';

@Component({
    selector: 'app-mt-meus-cursos',
    templateUrl: './certificados.component.html',
    // styleUrls: ['./acesso-restrito.component.css']
})
export class CertificadosComponent implements OnInit {
    //IMG_URL = environment.img_url;
    IMG_URL = environment.img_url + '/files/curso/imagem/';
    PDF_URL = environment.img_url + '/files/certificado/emitidos/';
    certificados: any;
    email;

    constructor(
        private alunoService: AlunoService,
    ) {}

    ngOnInit() {
        this.alunoService
            .getCertificadosDisponiveis(Number(localStorage.getItem('usuario_id')))
            .subscribe((certificados) => {
                this.certificados = certificados.items;
                this.certificados.showSent = false;
            });

        this.email = localStorage.getItem('email');
    }

    /**
     * é necessário implementar o método.
     * @param certificado
     */
    sendCertificado(certificado) {
        certificado.showSent = true;

        this.alunoService.sendCertificadoEmail({idCertificado: certificado.id})
            .subscribe((response) => {
                setTimeout(() => {
                    certificado.showSent = false;
                }, 4000);            
        });
    }
}
