import { Component, OnInit } from '@angular/core';
import { PoliticaTermosService } from '../politica-termos.service';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-termos',
  templateUrl: './termos.component.html',
  styleUrls: ['./termos.component.css']
})
export class TermosComponent implements OnInit {
  IMG_URL = environment.img_url

  constructor(private politicaTermosService: PoliticaTermosService,
              private headerService: HeaderService,
              private configuracoesStore: ConfiguracoesStore,
  ) { }

  termos: any;

  ngOnInit() {
    this.headerService.selectedItem.next('');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.politicaTermosService.getTermos(environment.faculdade_id).subscribe((termos) => {
        this.termos = termos.items;   
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }  

}
