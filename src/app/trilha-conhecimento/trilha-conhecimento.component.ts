import { Component, OnInit } from '@angular/core';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';
import { Trilha, TrilhaConfiguracao } from 'src/app/trilha-conhecimento/trilha-conhecimento.model';
import { HeaderService } from 'src/app/header/header.service';

import { environment } from '../../environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-trilha-conhecimento',
  templateUrl: './trilha-conhecimento.component.html',
  styleUrls: ['./trilha-conhecimento.component.css']
})
export class TrilhaConhecimentoComponent implements OnInit {

  constructor(private trilhasService: TrilhasService, private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService) { }

  trilhas: Trilha[];
  trilhaconf: any;
  IMG_URL = environment.s3_url;

  ngOnInit() {
    this.headerService.selectedItem.next('trilha');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.headerService.getBanner(environment.faculdade_id,'trilhasconhecimento').subscribe((ApiResponse) => {   
        this.headerService.changeBanner.next(ApiResponse.items);
      });

      this.trilhasService.getCategoriasComTrilhasCadastradas(environment.faculdade_id).subscribe((apiResponse)=>{
        this.trilhas = apiResponse.items;
      });

      this.trilhasService.getConfiguracaoTrilha('' + environment.faculdade_id).subscribe((trilhasconf) => {
        this.trilhaconf = trilhasconf.items[0];
      });


    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

}
