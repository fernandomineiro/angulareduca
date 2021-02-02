import { Component, OnInit } from '@angular/core';
import { AgendaService } from '../agenda.service';
import { HeaderService } from 'src/app/header/header.service';
import { Agenda } from '../agenda.model';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-agenda-cursos',
  templateUrl: './agenda-cursos.component.html',
  styleUrls: ['./agenda-cursos.component.css']
})
export class AgendaCursosComponent implements OnInit {

  constructor(
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {
    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });
  }

}
