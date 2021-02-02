import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/pedido/pedido.service';
import { Router } from '@angular/router';
import {environment} from '../../../../environments/environment';
import * as _ from 'underscore';
import { ActivatedRoute } from '@angular/router';
import { AlunoService } from 'src/app/aluno/aluno.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {

  constructor(private pedidosService: PedidoService,
    private router: Router,private route: ActivatedRoute, private alunoService: AlunoService) { }

    IMG_URL = environment.img_url;
    pedidos: any[];
    cursoId
    cursoPedido
    curso
    voucher
    certificados
    existeCertificado
    certificado
    PDF_URL = environment.img_url + '/files/certificado/emitidos/';

  ngOnInit() {
    this.cursoId = this.route.parent.snapshot.params['id'];

    this.alunoService.emiteCertificado(Number(localStorage.getItem('usuario_id')),this.cursoId).subscribe((APIResponse)=>{
      this.alunoService.getCertificadosDisponiveis(Number(localStorage.getItem('usuario_id'))).subscribe((certificados) => {
        this.certificados = certificados.items;              
        this.certificados.forEach((value, i) => {                 
          if(value.fk_curso == this.cursoId) {
            this.existeCertificado = true;
            this.certificado = value;
          }
        });                          
  });
    }); 

   
    console.log(" this.cursoId", this.cursoId);
    this.pedidosService.getPedidosByAlunoId(Number(localStorage.getItem('usuario_id'))).subscribe((ApiResponse) => {
      this.pedidos = ApiResponse.items;
      this.pedidos.every((value,i)=>{
        var found = _.findWhere(value.items, {fk_curso:Number(this.cursoId)});
        if(found != undefined && value.status == 2){
          this.cursoPedido = value;
          this.curso = found;          
          return false;
        }
         
        return true;
      });
      console.log("cursoPedido", this.cursoPedido); 
      console.log("cursoPedido", this.curso);      
  });

  }

 

}
