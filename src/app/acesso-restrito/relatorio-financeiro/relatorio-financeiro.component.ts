import { Component, OnInit, ViewChild } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Perfil } from 'src/app/perfil/perfil.enum';
import { LoginService } from 'src/app/security/login/login.service';
import { DataTableDirective } from 'angular-datatables';
import { NotificationService } from 'src/app/shared/messages/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-relatorio-financeiro',
  templateUrl: './relatorio-financeiro.component.html',
  styleUrls: ['./relatorio-financeiro.component.scss']
})
export class RelatorioFinanceiroComponent implements OnInit {
  form: FormGroup;
  pedidos: { [key: string]: string }[] = [];
  faculdades: { [key: string]: string }[] = [];
  modalidades: { [key: string]: string }[] = [];
  status: { [key: string]: string }[] = [];
  dtOptions: DataTables.Settings = {};
  total = 0;
  
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  constructor(
    private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private notificationService: NotificationService,
    private acessoRestritoSidebar: AcessoRestritoSidebarService,
  ) { }

  get tiposPerfil() {
    return Perfil;
  }

  get perfilId() {
    return this.loginService.getPerfil();
  }

  ngOnInit(): void {
    this.construirForm();
    this.constuirDatatable();
  }

  filtrar(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  exportarLista(event: any): void {
    if (this.total <= 7000) {
      event.target.disabled = true;
      this.notificationService.notify('Seu arquivo está sendo exportado, por favor, espere alguns segundos.', 'info');
  
      this.acessoRestritoSidebar.exportarRelatorioFinanceiro(this.prepareDadosParaFiltrar())
        .subscribe(response => {
          // @todo - Fechar notificacao anterior caso ja tenha terminado a requisicao.
          this.baixar(response);
          event.target.disabled = false;
          this.notificationService.notify('Arquivo exportado com sucesso!', 'success');
        }, () => {
          // @todo - Fechar notificacao anterior caso ja tenha terminado a requisicao.
          event.target.disabled = false;
          this.notificationService.notify('Houve alguma falha ao exportar o arquivo, entre em contato conosco para avisar!', 'notice');
        });
    } else {
      this.notificationService.notify('Caso não consiga exportar o seu relatório, por favor, faça mais filtros!', 'notice');
    }
  }

  private baixar(response): void {
    const blob = new Blob([response], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const objectUrl = window.URL.createObjectURL(blob);
    const hoje = new Date();
    const hojeFormatado = this.datepipe.transform(hoje, 'yyyyMMddHHmmss');

    link.href = objectUrl;
    link.download = 'relatorio_financeiro_' + hojeFormatado + '.xlsx';
    link.click();

    URL.revokeObjectURL(objectUrl);
  }

  private carregarFiltros(): void {
    this.acessoRestritoSidebar.carregarFiltrosRelatorioFinanceiro()
      .subscribe(response => {
        if (response[`faculdades`]) {
          Object.keys(response[`faculdades`]).forEach(key => {
            this.faculdades.push({ key, value: response[`faculdades`][key] });
          });
        }

        Object.keys(response[`status`]).forEach(key => {
          this.status.push({ key, value: response[`status`][key] });
        });

        Object.keys(response[`modalidades`]).forEach(key => {
          this.modalidades.push({ key, value: response[`modalidades`][key] });
        });
      });
  }

  private construirForm(): void {
    const hoje = new Date();
    let mesAtras = new Date();
    mesAtras = new Date((mesAtras.setMonth(mesAtras.getMonth() - 1)));

    this.form = this.formBuilder.group({
      pedido_pid: [],
      pedidos_status: [''],
      produto_pago: [''],
      ies: [''],
      tipo_item: [''],
      nome_item: [],
      nome_professor: [],
      nome_produtora: [],
      nome_curador: [],
      data_compra_de: [mesAtras.toISOString().substring(0, 10)],
      data_compra_ate: [hoje.toISOString().substring(0, 10)],
    });

    this.carregarFiltros();
  }

  private constuirDatatable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      searching: false,
      ordering: false,
      lengthMenu: [5, 10, 25],
      language: { 
        url: 'assets/json/datatable.json' 
      },
      ajax: (dataTablesParameters: any, callback) => {
        const datatableParams = { 
          page: (dataTablesParameters.start / dataTablesParameters.length) + 1,
          length: dataTablesParameters.length
        };

        this.acessoRestritoSidebar.getRelatorioFinanceiro({...datatableParams, ...this.prepareDadosParaFiltrar()})
          .subscribe(response => {
            this.total = response.total;
            this.pedidos = response.data;

            callback({
              recordsTotal: response.total,
              recordsFiltered: response.total,
              data: []
            });
          });
      }
    };
  }

  private prepareDadosParaFiltrar(): object {
    const values = this.form.value;

    if (this.perfilId !== Perfil.Professor) {
      delete values.ies;
    } else {
      delete values.nome_professor;
    }

    return values;
  }
}
