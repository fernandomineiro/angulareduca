import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TutoriaService} from '../../../tutoria/tutoria.service';

@Component({
    selector: 'app-mt-meus-cursos',
    templateUrl: './meus-trabalhos.component.html',
    // styleUrls: ['./acesso-restrito.component.css']
})
export class MeusTrabalhosComponent implements OnInit {
    IMG_URL = environment.img_url;
    trabalhos: any[];

    constructor(
        private tutoriaService: TutoriaService,
    ) {}

    ngOnInit() {
        this.tutoriaService
            .getUsuarioTrabalhos(localStorage.getItem('usuario_id'))
            .subscribe((ApiResponse) => {
                this.trabalhos = ApiResponse.items;
            });
    }

}
