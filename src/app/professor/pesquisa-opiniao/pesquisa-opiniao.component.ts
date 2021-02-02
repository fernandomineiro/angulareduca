import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-pesquisa-opiniao',
  templateUrl: './pesquisa-opiniao.component.html',
  styleUrls: ['./pesquisa-opiniao.component.scss']
})
export class PesquisaOpiniaoComponent implements OnInit {

  constructor(
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  eval = [0, 0, 0, 0, 0, 0];
  ngOnInit() {
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });
  }

}
