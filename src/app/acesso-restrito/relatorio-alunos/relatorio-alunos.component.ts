import { Component, OnInit } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import { HeaderService } from 'src/app/header/header.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-relatorio-alunos',
  templateUrl: './relatorio-alunos.component.html',
  styleUrls: ['./relatorio-alunos.component.scss']
})
export class RelatorioAlunosComponent implements OnInit {

  constructor(private acessoRestritoSidebarService: AcessoRestritoSidebarService,
    private headerService: HeaderService) { }

  alunos
  displayedColumns: string[] = ['id', 'full_name', 'data_nascimento', 'cpf', 'identidade', 'email', 'telefones', 'curso_superior', 'universidade', 'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf_estado', 'criacao'];
  tableInfo
  exportar = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('currentPage') currentPage;
  @ViewChild('searchId') searchId;
  @ViewChild('searchNome') searchNome;
  @ViewChild('searchEmail') searchEmail;
  @ViewChild('searchCPF') searchCPF;
  @ViewChild('searchDtCompraI') searchDtCompraI;
  @ViewChild('searchDtCompraF') searchDtCompraF;
  ngOnInit() {
    this.headerService.changeNavColor.next('#DBDADA');
    this.searchDtCompraF.nativeElement.value = new Date();
    this.getAlunos('');
  }

  getAlunos(query) {
    if (this.exportar) {
      this.acessoRestritoSidebarService.getRelatoriosAlunoExport(query).subscribe((apiResponse) => {
        this.exportarRelatorios(apiResponse);
        this.exportar = 0;
      });
    } else {
      this.acessoRestritoSidebarService.getRelatoriosAluno(query).subscribe((apiResponse) => {
        this.alunos = apiResponse;
        console.log("alunos", this.alunos);
        this.tableInfo = new MatTableDataSource(this.alunos.items.data);
        this.tableInfo.sort = this.sort;
        this.currentPage.nativeElement.value = 1;
      });
    }

  }

  changePage() {
    this.getAlunos('?page=' + this.currentPage.nativeElement.value);
  }

  nextPage() {
    this.currentPage++;
    if (this.alunos.next_page_url) {
      let splited = this.alunos.next_page_url.split('?');
      this.getAlunos('?' + splited[splited.length - 1]);
    }

  }

  prevPage() {
    this.currentPage--;
    if (this.alunos.prev_page_url) {
      let splited = this.alunos.prev_page_url.split('?');
      this.getAlunos('?' + splited[splited.length - 1]);
    }
  }

  submitSearch() {
    let searchArray = []
    if (this.searchId.nativeElement.value) {
      searchArray.push('aluno_id=' + this.searchId.nativeElement.value);
    }
    if (this.searchNome.nativeElement.value) {
      searchArray.push('nome=' + this.searchNome.nativeElement.value);
    }
    if (this.searchEmail.nativeElement.value) {
      searchArray.push('email=' + this.searchEmail.nativeElement.value);
    }
    if (this.searchCPF.nativeElement.value) {
      searchArray.push('cpf=' + this.searchCPF.nativeElement.value);
    }
    if (this.searchDtCompraI.nativeElement.value) {
      searchArray.push('data_inicial=' + this.searchDtCompraI.nativeElement.value);
    }
    if (this.searchDtCompraF.nativeElement.value) {
      searchArray.push('data_final=' + this.searchDtCompraF.nativeElement.value);
    }
    if (this.exportar) {
      searchArray.push('export=1');
    }
    if (searchArray.length) {
      this.getAlunos('?' + searchArray.join('&'));
    } else {
      this.getAlunos('');
    }
  }

  exportarRelatorios(apiResponse) {
    var response = apiResponse as any;
    var contentType = 'application/x-msexcel';
    var blob = new Blob([response], { type: contentType });
    var link = document.createElement('a');
    var object_URL = window.URL.createObjectURL(blob)
    link.href = object_URL;
    link.download = "relatorio-alunos.xls";
    link.click();
    URL.revokeObjectURL(object_URL);
  }




}
