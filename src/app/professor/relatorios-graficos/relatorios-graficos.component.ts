import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { ProfessorService } from 'src/app/professor/professor.service';
import * as _ from 'underscore';
import $ from 'jquery';
import * as Highcharts from 'highcharts';
import { ParceirosService } from 'src/app/home/parceiros/parceiros.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);


@Component({
  selector: 'app-relatorios-graficos',
  templateUrl: './relatorios-graficos.component.html',
  styleUrls: ['./relatorios-graficos.component.scss']
})
export class RelatoriosGraficosComponent implements OnInit {



  constructor(private headerService: HeaderService, private professorService: ProfessorService,
              private parceirosService: ParceirosService, private sanitizer: DomSanitizer,
              private configuracoesStore: ConfiguracoesStore,
              ) { }

  today = new Date();
  relatoriosData;
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  currentDay = this.today.getDate();
  days = [];
  splitedData = [];
  vendasData;
  vendasDataChart = [];
  plotLineValue;
  totalVendas;
  selectedIES = environment.faculdade_id;
  selectedYear = "2019"
  parceiros
  fileUrl
  viewAsList = false;
  hideIES = !(localStorage.getItem('perfil') != '15' || localStorage.getItem('perfil') != '19');
  hideIESFromIES = localStorage.getItem('perfil') != '2';
  ngOnInit() {

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.days = [];
    this.relatoriosData = undefined;
    this.splitedData = [];
    this.vendasData;
    this.vendasDataChart = [];


    this.parceirosService.getParceiros().subscribe((parceiros) => {
      this.parceiros = parceiros.items;
      this.professorService.getRelatorios(Number(this.currentMonth) + 1, this.selectedYear, this.selectedIES).subscribe((apiResponse) => {
        this.relatoriosData = apiResponse.items as any;
        this.vendasData = Object.values(this.relatoriosData.vendas.vendasPorDia);
        this.generateDays();
        this.splitDataByDay();
        this.getPlotLineInfo();
        this.getTotalVendas();
        Highcharts.chart('vendas', <any>this.returnOptionsChart());
        console.log("this.splitedData", this.splitedData);
      })
    })


  }

  numberOfDays(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
  }

  getTotalVendas() {
    this.totalVendas = 0;
    this.splitedData.forEach((value, i) => {
      this.totalVendas += value.y;
    })
  }

  generateDays() {
    this.days = Object.keys(this.vendasData).map((num) => { return Number(num) + 1 });
  }

  getPlotLineInfo() {
    this.plotLineValue = _.max(this.splitedData, function (o) { return o.y; });
  }

  splitDataByDay() {
    this.vendasData.forEach((value, i) => {
      var total = 0;
      if (value != 0) {
        this.splitedData.push({
          y: 0,
          coursesInfo: []
        })
        if (value.length != undefined) {
          value.forEach((value2, i2) => {
            total += value2.valor;
            this.splitedData[i].coursesInfo.push({
              courseName: value2.curso,
              courseAccess: value2.valor
            })
          })
          this.splitedData[i].y = total;
        } else {
          this.splitedData[i].y = value.valor;
          this.splitedData[i].coursesInfo.push({
            courseName: value.curso,
            courseAccess: value.valor
          })
        }
      }
      else {
        this.splitedData.push({
          y: 0,
          coursesInfo: []
        })
      }


    });
  }

  returnOptionsChart() {
    var options = {
      chart: {
        type: 'area',
        height: 300,
        backgroundColor: 'transparent',
        fontFamily: 'encodeSansCondensed-Regular'
      },
      title: {
        text: ''
      },
      xAxis: {
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        categories: this.days,
        plotLines: [{
          color: '#F2652A',
          width: 2,
          value: this.splitedData.indexOf(this.plotLineValue),
          label: {
            text: 'R$ ' + this.plotLineValue.y.toFixed(2).toString().replace('.', ','),
            rotation: 0
          },
          events: {
            mouseover: function (e) {

            },
            mouseout: function (e) {

            }
          }
        }]
      },
      yAxis: {
        labels: {
          formatter: function () {                  
              return 'R$ ' + this.value.toFixed(2).toString().replace('.',',');           
          }
        },

        title: {
          enabled: false
        },

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
          if (!this.point.coursesInfo.length)
            return false
          var template = '';
          this.point.coursesInfo.forEach(function (value, i) {
            template += '<div>' + value.courseName + ': <span> R$ ' + value.courseAccess.toFixed(2).toString().replace('.', ',') + '</span></div>';
          });
          return '<div style="background-color:#ECECEC;padding:15px;"><div>' + template + '</div></div>';
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "",
        color: "#FCEACB",
        data: this.splitedData,
      }],
      plotOptions: {
        series: {
          stickyTracking: false,
        }
      }
    }

    return options
  }

  getTotal(curso){
    var amount = 0;
    this.splitedData.forEach((value,i)=>{
      value.coursesInfo.forEach((value2,i2)=>{
        if(curso.curso.includes(value2.courseName)){
          amount += value2.courseAccess;
        }
      });
    });
    return amount;
  }

  exportarRelatorios(){
    this.professorService.exportarRelatorios(Number(this.currentMonth) + 1, this.selectedYear, this.selectedIES).subscribe((apiResponse) => {
      console.log("apiresponse",apiResponse);
      var response = apiResponse as any;
      var contentType = 'application/x-msexcel';
      var blob = new Blob([response], { type:contentType });
      var link = document.createElement('a');
      var object_URL = window.URL.createObjectURL(blob)
      link.href = object_URL;
      link.download = "relatorio-fatura.xls";
      link.click();
      URL.revokeObjectURL(object_URL);
    });
  }

}
