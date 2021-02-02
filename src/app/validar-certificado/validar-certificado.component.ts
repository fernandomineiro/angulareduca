import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ApiResponse } from 'src/app/app.api';
import { ADDRESS_API } from 'src/app/app.api';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-validar-certificado',
  templateUrl: './validar-certificado.component.html',
  styleUrls: ['./validar-certificado.component.scss']
})
export class ValidarCertificadoComponent implements OnInit {

  constructor(
      private headerService: HeaderService,
      private http: HttpClient,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  codigo: any;
  IMG_URL = environment.img_url;

  ngOnInit() {
    this.headerService.selectedItem.next('');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

  }


 


}
