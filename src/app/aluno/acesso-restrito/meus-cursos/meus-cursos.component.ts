import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../../curso/cursos.service';
import { environment } from '../../../../environments/environment';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';
import {Configuracao} from '../../../configuracao.model';

@Component({
    selector: 'app-mt-meus-cursos',
    templateUrl: './meus-cursos.component.html',
    styleUrls: ['./meus-cursos.component.scss']
})
export class MeusCursosComponent implements OnInit {

    IMG_URL = environment.img_url;
    cursos: any = [];
    presenciais: any = [];
    remotos: any = [];
    trilhasOnline: any = [];
    trilhasRemotos: any = [];
    trilhasPresenciais: any = [];
    assinaturas: any = [];
    eventos: any = [];
    configuracoes: Configuracao;

    constructor(
        private cursosService: CursosService,
        private configuracoesStore: ConfiguracoesStore,
    ) {}

    ngOnInit() {
        const idAluno = localStorage.getItem('usuario_id');

        this.configuracoesStore.state$.subscribe(state => {
            this.configuracoes = state.configuracao;
        });

        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_online) {
            this.cursosService
                .getCursosOnlineIniciadosPorAluno(idAluno)
                .subscribe((ApiResponse) => {
                    this.cursos = ApiResponse.items;
                });
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_presenciais) {
            this.cursosService
                .getCursosPresenciaisPorAluno(idAluno)
                .subscribe((ApiResponse) => {
                    this.presenciais = ApiResponse.items;
                });
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_cursos_hibridos) {
            this.cursosService
                .getCursosRemotosPorAluno(idAluno)
                .subscribe((ApiResponse) => {
                    this.remotos = ApiResponse.items;
                });
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_trilha_conhecimento) {
            this.cursosService.getTrilhasOnlinePorAluno(idAluno)
                .subscribe(apiResponse => {
                    this.trilhasOnline = apiResponse.items;
                });

            this.cursosService.getTrilhasPresenciaisPorAluno(idAluno)
                .subscribe(apiResponse => {
                    this.trilhasPresenciais = apiResponse.items;
                });

            this.cursosService.getTrilhasRemotosPorAluno(idAluno)
                .subscribe(apiResponse => {
                    this.trilhasRemotos = apiResponse.items;
                });
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_membership) {
            this.cursosService.getAssinaturas()
                .subscribe(apiResponse => {
                    this.assinaturas = apiResponse.items;
                    console.log(apiResponse);
                });
        }

        if (this.configuracoes.tiposCursosAtivos.ativar_eventos) {
            this.cursosService.getEventosAluno(idAluno)
                .subscribe(apiResponse => {
                    this.eventos = apiResponse.items;
                    console.log(apiResponse);
                });
        }
    }

    toNumber(value): number {
        return Number(value);
    }
}
