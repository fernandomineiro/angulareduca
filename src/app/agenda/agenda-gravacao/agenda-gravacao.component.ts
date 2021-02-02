import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AgendaComponent } from '../agenda.component';
import { HeaderService } from 'src/app/header/header.service';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-agenda-gravacao',
  templateUrl: './agenda-gravacao.component.html',
  styleUrls: ['./agenda-gravacao.component.css']
})
export class AgendaGravacaoComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  newRecord;
  submited: boolean = false;
  @ViewChild(AgendaComponent) agenda;
  
  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.newRecord = this.formBuilder.group({
      courseName: ['',[Validators.required]],
      teacher: ['',[Validators.required]],
      place: ['',[Validators.required]],
      date: ['',[Validators.required]],  
      timeStart: ['',[Validators.required]],
      timeEnd: ['',[Validators.required]], 
      totalModules: ['',[Validators.required, Validators.pattern('^\\d*[1-9]\\d*$')]],
      recordedModules: ['',[Validators.required, Validators.pattern('^\\d*[0-9]\\d*$')]],
    });

  }

  onFormSubmit(){
    this.submited = true;
    this.agenda.ngOnInit();
  }
  

}
