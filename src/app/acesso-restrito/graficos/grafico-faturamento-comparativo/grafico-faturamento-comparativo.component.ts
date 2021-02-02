import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ViewChild } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import * as Highcharts from 'highcharts';
import { CurrencyPipe } from '@angular/common';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import * as _ from 'underscore';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let HC_exportData = require('highcharts/modules/exporting');
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
HC_exportData(Highcharts);

@Component({
  selector: 'app-grafico-faturamento-comparativo',
  templateUrl: './grafico-faturamento-comparativo.component.html',
  styleUrls: ['./grafico-faturamento-comparativo.component.scss']
})
export class GraficoFaturamentoComparativoComponent implements OnInit {

  constructor(private headerService: HeaderService, private acessoRestritoSidebarService: AcessoRestritoSidebarService, private currencyPipe: CurrencyPipe, private configuracoesStore: ConfiguracoesStore, ) { }

  @ViewChild('periodoInicial') periodoInicial;
  @ViewChild('periodoFinal') periodoFinal;
  @ViewChild('agrupamento') agrupamento;

  data
  configuracoes
  viewAsList = false

  ngOnInit() {
    this.headerService.changeNavColor.next('#DBDADA');
    this.periodoFinal.nativeElement.valueAsDate = new Date();
    var x = new Date();
    x.setDate(1);
    x.setMonth(x.getMonth() - 1);
    this.periodoInicial.nativeElement.valueAsDate = x;
    this.agrupamento.nativeElement.value = 'semana';

    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
      this.submitSearch();

    });
  }

  submitSearch() {
    let query = [];
    if (this.periodoFinal.nativeElement.value && this.periodoInicial.nativeElement.value) {
      query.push('data_inicial=' + this.periodoInicial.nativeElement.value);
      query.push('data_final=' + this.periodoFinal.nativeElement.value);
    }
    if (this.agrupamento.nativeElement.value) {
      query.push('agrupar_por=' + this.agrupamento.nativeElement.value);
    }
    if (query.length) {
      this.getData('?' + query.join('&'));
    }
    else {
      this.getData('')
    }
  }

  getData(query) {
    this.acessoRestritoSidebarService.getGraficoFaturamentoComparativo(query).subscribe((apiResponse) => {
      this.data = apiResponse.data;
      Highcharts.chart('vendas', <any>this.returnOptionsChart());
    })
  }

  getChartCategories() {
    let categories = [];
    if (this.agrupamento.nativeElement.value == 'semana')
      this.data.forEach(value => {
        categories.push('Semana ' + value.semana)
      })
    else if (this.agrupamento.nativeElement.value == 'mes')
      this.data.forEach(value => {
        categories.push('Mes ' + value.mes)
      })
    else
      this.data.forEach(value => {
        categories.push('Ano ' + value.ano)
      })
    return categories;
  }

  getChartData() {
    let chartData = [];
    this.data.forEach(value => {
      chartData.push({
        y: value.faturamento,
        liquido: value.liquido,
        unidades: value.unidades,
        impostos: value.impostos_taxas
      })
    })
    return chartData;
  }

  returnOptionsChart() {
    let currencyPipe = this.currencyPipe;
    var options = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: this.getChartCategories(),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Faturamento (R$)'
        }
      },
      tooltip: {
        backgroundColor: null,
        borderWidth: 0,
        shadow: false,
        followPointer: true,
        useHTML: true,
        style: {
          padding: 0
        },
        formatter: function () {
          return `
          <div style="padding: 15px 0;">
            <div style="background-color:#ECECEC;padding:0 15px;"><div> Faturamento: ` + currencyPipe.transform(this.point.y, 'BRL') + `</div></div>          
            <div style="background-color:#ECECEC;padding:0 15px;"><div> Líquido: ` + currencyPipe.transform(this.point.liquido, 'BRL') + `</div></div>
            <div style="background-color:#ECECEC;padding:0 15px;"><div> Impostos e taxas: ` + currencyPipe.transform(this.point.impostos, 'BRL') + `</div></div>
            <div style="background-color:#ECECEC;padding:0 15px;"><div> Unidades: ` + this.point.unidades + `</div></div>
          </div>
          `;
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          color: _.findWhere(this.configuracoes.estilos, { nome: 'defaultColorTheme' }).value,
          opacity: 0.5,
          fillOpacity: 0.5,
        }
      },
      series: [{
        name: 'Faturamento',
        data: this.getChartData()

      }],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true
      },
      lang: {
        printChart: 'Imprimir gráfico',
        downloadPNG: 'Download PNG',
        downloadJPEG: 'Download JPEG',
        downloadPDF: 'Download PDF',
        downloadSVG: 'Download SVG',
        contextButtonTitle: 'Context menu',
        viewFullscreen: 'Visualizar em tela cheia'
      },
      legend: {
        enabled: false
      },

    }
    return options;
  }

}
