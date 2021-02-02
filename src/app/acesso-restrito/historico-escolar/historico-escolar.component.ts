import { Component, OnInit } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import { MatTableDataSource } from '@angular/material';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import { HeaderService } from 'src/app/header/header.service';

@Component({
  selector: 'app-historico-escolar',
  templateUrl: './historico-escolar.component.html',
  styleUrls: ['./historico-escolar.component.scss']
})
export class HistoricoEscolarComponent implements OnInit {

  constructor(
    private acessoRestritoSidebarService: AcessoRestritoSidebarService,
    private headerService: HeaderService,) { }


  historico;

  tableInfo = [];

  displayedColumnsOnline: string[] = ['nome', 'professor_nome', 'nota_quiz', 'nota_trabalho', 'media', 'carga_horaria', 'situacao', 'data_inicio', 'data_conclusao'];
  displayedColumnsPresencialRemoto: string[] = ['nome', 'professor_nome', 'nota_quiz', 'nota_trabalho', 'media', 'carga_horaria', 'frequencia', 'situacao', 'data_inicio', 'data_conclusao'];

  found;

  empty;

  online = [];
  remoto = [];
  presencial = [];

  typeSearch = 'cpf'

  ngOnInit() {    
      this.headerService.changeNavColor.next('#DBDADA');
  }

  arrangeToTable() {
    this.online = [];
    this.remoto = [];
    this.presencial = [];
    let semestres = Object.keys(this.historico.semestres);
    semestres.forEach((element, i) => {
      let online, remoto, presencial;
      this.online.push(0);
      this.presencial.push(0);
      this.remoto.push(0);
      if (this.historico.semestres[element].online) {
        online = Object.values(this.historico.semestres[element].online);
        online.forEach(el2 => {
          if (el2.carga_horaria != '--')
            this.online[i] += el2.carga_horaria;
        })
        online = new MatTableDataSource(online);
      }
      if (this.historico.semestres[element].remoto) {
        remoto = Object.values(this.historico.semestres[element].remoto);
        remoto.forEach(el2 => {
          if (el2.carga_horaria != '--')
            this.remoto[i] += el2.carga_horaria;
        })
        remoto = new MatTableDataSource(remoto);
      }
      if (this.historico.semestres[element].presencial) {
        presencial = Object.values(this.historico.semestres[element].presencial);
        presencial.forEach(el2 => {
          if (el2.carga_horaria != '--')
            this.presencial[i] += el2.carga_horaria;
        })
        presencial = new MatTableDataSource(presencial);
      }
      this.tableInfo.push({
        semestre: element,
        online: online,
        remoto: remoto,
        presencial: presencial
      });
    });

  }

  sendSeach(value) {
    this.historico = undefined;
    this.tableInfo = [];
    if(this.typeSearch == 'nome')
      value = encodeURI(value);   
    this.acessoRestritoSidebarService.getHistoricoEscolas(value).subscribe((apiResponse) => {
      if (apiResponse.success == false) {
        this.found = false;
      } else {
        this.found = true;
        this.historico = apiResponse;
        if (this.historico.semestres) {
          this.arrangeToTable();
          this.empty = false;
        } else
          this.empty = true;
      }

    });

  }

  cpfMask(event) {
    if(this.typeSearch == 'cpf')
      event.target.value = this.mask(event.target.value);
  }

  mask(value) {
    if(this.typeSearch == 'cpf')
      return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
  }

}
