import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { StatusAprovacaoService } from '../status-aprovacao.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-aprovacao-fixes',
  templateUrl: './aprovacao-fixes.component.html',
  styleUrls: ['./aprovacao-fixes.component.css']
})
export class AprovacaoFixesComponent implements OnInit {
  IMG_URL = environment.img_url;
  fixes: {};

  constructor(
      private headerService: HeaderService,
      private statusAprovacaoService: StatusAprovacaoService,
      private route: ActivatedRoute,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {
      this.statusAprovacaoService.getFixes(this.route.snapshot.params.id).subscribe((fixes) => {
        this.fixes = fixes;                 
      });
    } catch (error) {
      console.log('==== error ====', error);
    }
  }
}
