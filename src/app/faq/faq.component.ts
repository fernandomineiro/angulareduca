import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header/header.service';
import { FaqService } from './faq.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private headerService: HeaderService, private configuracoesStore: ConfiguracoesStore, private faqService: FaqService) { }
  
  IMG_URL = environment.img_url
  faq: any;
  perguntas: any;

  ngOnInit() {

    this.headerService.selectedItem.next('');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.faqService.getFaq().subscribe((faq) => {
        this.faq = faq; 
        console.log(this.faq);
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

  }

}
