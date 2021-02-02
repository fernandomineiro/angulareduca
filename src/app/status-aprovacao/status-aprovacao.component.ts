import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';
import { StatusAprovacaoService } from './status-aprovacao.service';
import { StatusAprovacao } from './status-aprovacao.model';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-status-aprovacao',
  templateUrl: './status-aprovacao.component.html',
  styleUrls: ['./status-aprovacao.component.css']
})
export class StatusAprovacaoComponent implements OnInit {

  constructor(private headerService: HeaderService, private configuracoesStore: ConfiguracoesStore,
              private statusAprovacaoService: StatusAprovacaoService) { }

  statusAprovacao: StatusAprovacao[];
  panelOpenState = [];
  IMG_URL = environment.img_url;

  ngOnInit() {
    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {
      this.statusAprovacaoService.getCoursesStatus(localStorage.getItem('usuario_id')).subscribe((statusAprovacao) => {
        this.statusAprovacao = statusAprovacao.items;  
        this.statusAprovacao.forEach(element => {
          this.panelOpenState.push(false);
        });         
      });

    } catch (error) {
      console.log('==== error ====', error);
    }
  }
}
