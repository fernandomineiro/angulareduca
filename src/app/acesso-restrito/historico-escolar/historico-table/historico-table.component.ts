import { Component, OnInit } from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';


@Component({
  selector: 'app-historico-table',
  templateUrl: './historico-table.component.html',
  styleUrls: ['./historico-table.component.scss']
})
export class HistoricoTableComponent implements OnInit {

  constructor() { }

  @Input() data;
  @Input() displayedColumns;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

}
