import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ViewChild } from '@angular/core';
import { AcessoRestritoSidebarService } from 'src/app/acesso-restrito-sidebar/acesso-restrito-sidebar.service';
import * as Highcharts from 'highcharts';
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
  selector: 'app-grafico-assinaturas',
  templateUrl: './grafico-assinaturas.component.html',
  styleUrls: ['./grafico-assinaturas.component.scss']
})
export class GraficoAssinaturasComponent implements OnInit {

  constructor(private headerService: HeaderService, private acessoRestritoSidebarService: AcessoRestritoSidebarService, private configuracoesStore: ConfiguracoesStore, ) { }

  @ViewChild('periodoInicial') periodoInicial;
  @ViewChild('periodoFinal') periodoFinal;
  @ViewChild('agrupamento') agrupamento;

  dataAbandonadas
  dataAbandonadasList
  dataCanceladas
  dataCanceladasList
  dataRealizadas
  dataRealizadasList
  range
  dataAtivos
  configuracoes
  viewAsList = false
  categoriesForList
  typeAssinatura = 'other'

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
    this.acessoRestritoSidebarService.getGraficoAssinaturasAbandonadas(query).subscribe((apiResponse) => {
      this.dataAbandonadas = apiResponse.data;
      this.acessoRestritoSidebarService.getGraficoAssinaturasCanceladas(query).subscribe((apiResponse2) => {
        this.dataCanceladas = apiResponse2.data;
        this.acessoRestritoSidebarService.getGraficoAssinaturasRealizadas(query).subscribe((apiResponse3) => {
          this.dataRealizadas = apiResponse3.data;
          this.findMinMax();
          Highcharts.chart('vendas', <any>this.returnOptionsChart());
        })
      })

    })
  }

  getChartCategories() {
    let categories = [];
    this.range.forEach(value=>{
      console.log("range categories ", value)
      if (this.agrupamento.nativeElement.value == 'semana')      
        categories.push('Semana ' + value) 
      else if (this.agrupamento.nativeElement.value == 'mes')      
        categories.push('Mês ' + value)   
      else    
        categories.push('Ano ' + value)        
    });   
    console.log("categories ", categories)
    this.categoriesForList = categories;
    return this.categoriesForList;
  }

  findMinMax() {
    let min = 0;
    let max = 0;
    this.dataAbandonadas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] > max)       
        max = value[this.agrupamento.nativeElement.value]
    })
    this.dataRealizadas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] > max)
        max = value[this.agrupamento.nativeElement.value]
    })
    this.dataCanceladas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] > max)
        max = value[this.agrupamento.nativeElement.value]
    })
    min = max;
    this.dataAbandonadas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] < min)
        min = value[this.agrupamento.nativeElement.value]
    })
    this.dataCanceladas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] < min)
        min = value[this.agrupamento.nativeElement.value]
    })
    this.dataRealizadas.forEach(value => {
      if (value[this.agrupamento.nativeElement.value] < min)
        min = value[this.agrupamento.nativeElement.value]
    })
    this.range = _.range(min,max+1)
    console.log("min: ",min, "max: ", max, "range: ", this.range)
  }

  getChartDataAbandonadas() {
    let chartData = [];
    let found;
    this.range.forEach(value=>{
      console.log("range abandonadas ", value)
      if(this.agrupamento.nativeElement.value == 'semana')
        found = _.findWhere(this.dataAbandonadas, { semana : value})
      else if (this.agrupamento.nativeElement.value == 'mes')
        found = _.findWhere(this.dataAbandonadas, { mes : value})
      else
        found = _.findWhere(this.dataAbandonadas, { ano : value})
      if(found)
        chartData.push(found.total)
      else
        chartData.push('')  
    })
    this.dataAbandonadasList = chartData
    console.log('abandonadas',chartData)  
    return this.dataAbandonadasList;
  }

  getChartDataCanceladas() {
    let chartData = [];
    let found;
    this.range.forEach(value=>{
      console.log("range canceladas ", value)
      if(this.agrupamento.nativeElement.value == 'semana')
        found = _.findWhere(this.dataCanceladas, { semana : value})
      else if (this.agrupamento.nativeElement.value == 'mes')
        found = _.findWhere(this.dataCanceladas, { mes : value})
      else
        found = _.findWhere(this.dataCanceladas, { ano : value})
      if(found)
        chartData.push(found.total)
      else
        chartData.push('') 
    })
    this.dataCanceladasList = chartData
    console.log('canceladas',chartData)     
    return this.dataCanceladasList;
  }

  getChartDataRealizadas() {
    let chartData = [];
    let found;
    this.range.forEach(value=>{
      console.log("range realizadas ", value)
      if(this.agrupamento.nativeElement.value == 'semana')
        found = _.findWhere(this.dataRealizadas, { semana : value})
      else if (this.agrupamento.nativeElement.value == 'mes')
        found = _.findWhere(this.dataRealizadas, { mes : value})
      else
        found = _.findWhere(this.dataRealizadas, { ano : value})
      if(found)
        chartData.push(found.total)
      else
        chartData.push('') 
    })
   this.dataRealizadasList = chartData;
    console.log('realizadas',chartData)  
    return this.dataRealizadasList;
  }

  returnOptionsChart() {
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
          text: 'Quantidade'
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
            <div style="background-color:#ECECEC;padding:0 15px;">
              <div style="font-size:15px;margin-top:15px;margin-bottom:5px;"><b>`+ this.series.name +`</b></div>
              <div style="margin-bottom:15px"> Quantidade: ` + this.point.y + `</div>
            </div>         
          </div>
          `;
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }       
      },
      series: [{
        name: 'Abandonadas',
        data: this.getChartDataAbandonadas(),
        color: '#2e3131'
      },
      {
        name: 'Canceladas',
        data: this.getChartDataCanceladas(),
        color: '#cf000f'
      },
      {
        name: 'Realizadas',
        data: this.getChartDataRealizadas(),
        color: '#23cba7'
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

    }
    return options;
  }

}
