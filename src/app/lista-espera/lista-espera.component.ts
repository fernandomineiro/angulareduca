import { Component, OnInit } from '@angular/core';
import { ListaEsperaService } from 'src/app/lista-espera/lista-espera.service';
import { Input } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
    selector: 'app-lista-espera',
    templateUrl: './lista-espera.component.html',
    styleUrls: ['./lista-espera.component.css']
})
export class ListaEsperaComponent implements OnInit {
    IMG_URL = environment.img_url

    constructor(private listaEsperaService: ListaEsperaService, private configuracoesStore: ConfiguracoesStore,
                private headerService: HeaderService) { }

    @Input()
    listaEspera: any[];
    listaAvisaveis = [];
    success = false
    error = null

    ngOnInit() {

        this.headerService.selectedItem.next('user');
        this.success = false;
        this.error = null;

        this.configuracoesStore.state$.subscribe(state => {
            const confNavColor =
                state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
            this.headerService.changeNavColor.next(confNavColor);
        });

        try {
            this.listaEsperaService.getListasEspera().subscribe(
                (listaEspera) => {
                    this.listaEspera = listaEspera.items;
                },
                error => console.log('Error: ', error),
                () => {
                    console.log('completed');
                }
            );
        } catch (error) {
            console.log('==== error ====', error);
        }
    }


    enviaEmailInteressados() {
        console.log(this.listaAvisaveis)
        this.listaEsperaService.avisaInteressados(this.listaAvisaveis).subscribe( (apiResponse) => {
            if (apiResponse.success) {
                this.success = true;
                this.error = null;
            } else {
                this.error = apiResponse.error;
                this.success = false;
            }
            // this.getListStudents(course, course.selectedAgenda);
        });
    }

    selecionaAluno(dado, index, event) {
        if (event.target.checked == true) {
            console.log(index);
            this.listaAvisaveis.push(dado);
        } else {
            this.listaAvisaveis.splice(index, 1);
            console.log(this.listaAvisaveis);
        }
    }

}
