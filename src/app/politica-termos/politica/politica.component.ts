import { Component, OnInit } from '@angular/core';
import { PoliticaTermosService } from '../politica-termos.service';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-politica',
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.css']
})
export class PoliticaComponent implements OnInit {
  IMG_URL = environment.img_url
  constructor(private politicaTermosService: PoliticaTermosService,
              private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService) { }

  politicas: any;

  ngOnInit() {
    this.headerService.selectedItem.next('');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.politicaTermosService.getPoliticas(localStorage.getItem('faculdade')).subscribe((politicas) => {
        this.politicas = politicas.items;  
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

}
