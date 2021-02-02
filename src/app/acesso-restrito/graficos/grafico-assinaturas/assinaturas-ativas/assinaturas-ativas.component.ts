import { Component, OnInit } from '@angular/core';
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
  selector: 'app-assinaturas-ativas',
  templateUrl: './assinaturas-ativas.component.html',
  styleUrls: ['./assinaturas-ativas.component.scss']
})
export class AssinaturasAtivasComponent implements OnInit {

  constructor(private acessoRestritoSidebarService: AcessoRestritoSidebarService, private configuracoesStore: ConfiguracoesStore) { }

  range: any;
  @ViewChild('ano') ano;
  @ViewChild('mes') mes;
  configuracoes
  data
  viewAsList = false
  ngOnInit() {
    console.log("date",new Date().getMonth()+1) 
    let provMonth = (new Date().getMonth()+1).toString();
    provMonth = '0'+provMonth;
    this.mes.nativeElement.value = provMonth;
    this.ano.nativeElement.value = new Date().getFullYear();
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
      this.submitSearch();

    });
  }

  submitSearch(){
    let query;
    query = '?mes='+this.mes.nativeElement.value+'&ano=' + this.ano.nativeElement.value;
    this.getData(query);
  }

  getData(query) {
    this.acessoRestritoSidebarService.getGraficoAssinantesAtivos(query).subscribe((apiResponse) => {
      this.data = apiResponse.data;      
          Highcharts.chart('vendas1', <any>this.returnOptionsChart());
      
    })
  }

  getChartCategories(){
    let categories = [];
    this.data.forEach(value=>{
      categories.push(value.mes + '/' + value.ano);
    })
    return categories;
  }

  getChartData(){
    let data = [];
    this.data.forEach(value=>{
      data.push(value.total)
    })
    return data;
  }

  returnOptionsChart(){
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
          text: 'Quantidade de Assinantes'
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
            <div style="background-color:#ECECEC;padding:0 15px;"><div> Quantidade: ` +this.point.y + `</div></div> 
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
        name: 'Assinantes',
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
