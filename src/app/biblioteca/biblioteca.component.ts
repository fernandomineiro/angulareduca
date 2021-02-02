import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ConfiguracoesStore } from '../stores/configuracoes.store';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {

  constructor(
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  currentViewType = 'grid';
  isAvailable = false;

  ngOnInit() {

    this.headerService.selectedItem.next('biblioteca');

    this.configuracoesStore.state$.subscribe(state => {
      const navColor =
              state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : 'white';
      this.headerService.changeNavColor.next(navColor);
    });
  }

  changeViewType(type){
    this.currentViewType = type;
  }

  findCursos(){
    
  }


}
