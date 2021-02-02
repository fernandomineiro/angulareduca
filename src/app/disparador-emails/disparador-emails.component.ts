import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import $ from 'jquery';
import {MatSort, MatTableDataSource} from '@angular/material';
import { ViewChild } from '@angular/core';
import { DisparadorEmailsService } from 'src/app/disparador-emails/disparador-emails.service';
import { DisparadorEmails } from 'src/app/disparador-emails/disparador-emails.model';
import * as underscore from 'underscore';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-disparador-emails',
  templateUrl: './disparador-emails.component.html',
  styleUrls: ['./disparador-emails.component.css']
})

export class DisparadorEmailsComponent implements OnInit {
  IMG_URL = environment.img_url;
  listToSend = [];
  htmlContent;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '30rem',
    placeholder: 'Insira o texto aqui...',
    translate: 'no',
    uploadUrl: 'https://filebin.net/', // if needed
  };

  disparadorEmails: DisparadorEmails[];
  displayedColumns: string[] = ['name', 'category1', 'category2'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private headerService: HeaderService, private configuracoesStore: ConfiguracoesStore,
              private disparadorService: DisparadorEmailsService) { }

  ngOnInit() {

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.disparadorService.getLista().subscribe((disparadorEmails) => {
        this.disparadorEmails = disparadorEmails;
        this.dataSource = new MatTableDataSource(this.disparadorEmails);
        this.dataSource.sort = this.sort;
      });

    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  bindClickEditor() {
    $('#toggleEditorMode-').click(() => {
      $('#editor').attr('contenteditable', 'true');
    });
  }

  sendEmail() {
    let objectToSend = {
      content: this.htmlContent,
      idList: this.listToSend
    }
    this.disparadorService.sendEmail(objectToSend).subscribe((apiResponse) => {
    });
  }

  includeOnList(id: string) {
    let foundOnToSend = underscore.findWhere(this.listToSend, { id: id });

    if(foundOnToSend === undefined) {
      let found = underscore.findWhere(this.disparadorEmails, { id: id });
      this.listToSend.push({id: found.id});
    } else{
      console.log('entrei else');
      let index = underscore.findIndex(this.listToSend, { id: id })
      this.listToSend.splice(index,1);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
