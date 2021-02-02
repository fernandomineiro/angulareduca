import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../curso/cursos.service';
import { environment } from '../../../environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';
import {Configuracao} from '../../configuracao.model';
import {ActivatedRoute} from '@angular/router';
import {ParceirosService} from '../../home/parceiros/parceiros.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LoginService} from '../../security/login/login.service';

@Component({
    selector: 'app-mt-aluno-kroton',
    templateUrl: './aluno-kroton.component.html',
    styleUrls: ['./aluno-kroton.component.scss']
})
export class AlunoKrotonComponent implements OnInit {

    IMG_URL = environment.img_url;
    idCurso: any;
    url: any;
    configuracoes: Configuracao;

    constructor(
        private cursosService: CursosService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private loginService: LoginService,
        private configuracoesStore: ConfiguracoesStore,
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.idCurso = params.idcurso;
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(location.origin + '/#/meu-curso/' + this.idCurso + '/faca-aulas');
            this.loginService.loginKroton(params.cpfaluno).subscribe(
                () => {

                }, error => {
                    console.log(error);
                }
            );
        });
    }

    toNumber(value): number {
        return Number(value);
    }
}
