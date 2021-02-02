import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {PedidoService} from '../../../pedido/pedido.service';
import {Router} from '@angular/router';
import { CursosService } from 'src/app/curso/cursos.service';
import {PaymentService} from '../../../shopping-cart/payment/payment.service';
import {NotificationService} from '../../../shared/messages/notification.service';
import { DialogComponent } from 'src/app/header/dialog/dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import * as _ from 'underscore';

@Component({
    selector: 'app-mt-pedidos',
    templateUrl: './pedidos.component.html',
     styles: [`
        .certificado-info div,
        .modal-title,
        .teacher-name,
        .modal-body div{
            font-family: encodeSansCondensed-Regular;
        }
        
     `]
})
export class PedidosComponent implements OnInit {
    IMG_URL = environment.img_url;
    pedidos: any[];
    currentDetalhes;
    subs = new SubSink();
    configuracoes
    defaultColorTheme

    constructor(
        private pedidosService: PedidoService,
        private router: Router,
        private cursoService: CursosService,
        private notificationService: NotificationService,
        private paymentService: PaymentService,
        public dialog: MatDialog,
        private configuracoesStore: ConfiguracoesStore,
    ) {}

    ngOnInit() {
        this.buscarPedidos();
        this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
            this.configuracoes = state.configuracao;     
            this.defaultColorTheme = _.findWhere(this.configuracoes.estilos, { nome: 'defaultColorTheme' }).value;
          });
      
    }

    mostrarBtnCancelar(pedido) {
        let mostrarBotao = false;
        pedido.items.forEach((item) => {
            if (item.fk_assinatura && !mostrarBotao) {
                mostrarBotao = true;
            }
        });

        return mostrarBotao;
    }

    mostrarIconeCancelado(assinaturas) {
        let mostrarIcone = false;

        assinaturas.forEach((item) => {
            if (item.renovacao_cancelada && !mostrarIcone) {
                mostrarIcone = true;
            }
        });

        return mostrarIcone;
    }

    buscarPedidos() {
        this.pedidosService.getPedidosByAlunoId(Number(localStorage.getItem('usuario_id'))).subscribe((ApiResponse) => {
            this.pedidos = ApiResponse.items;
        });
    }

    cancelarAssinatura(pedido) {


        const dialogRef = this.dialog.open(DialogComponent, {
            data: { title: 'Cancelar assinatura', content: 'Você realmente deseja cancelar sua assinatura?' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                pedido.assinaturas.forEach((item) => {
                    this.paymentService.cancelarAssinatura(item.codigo_assinatura_wirecard).subscribe( (ApiResponse) => {
                        if (ApiResponse.success) {
                            this.notificationService.success(ApiResponse.success);
                            this.buscarPedidos();
                        } else if (ApiResponse.error) {
                            this.notificationService.error(ApiResponse.error);
                        }
                    });
                });
            }
        });
    }
    
    refazPagamento(item) {
        console.log(item);
        if (item.id) {
            localStorage.setItem('pedidoNo', item.id);
            let carrinho = [];
            let obj = {
                item_nome: item.pid,
                item_id: item.id,
                item_categoria: null,
                item_valor: item.valor_bruto,
                item_imagem: null
            };
            carrinho.push(obj);
            localStorage.setItem('carrinho2', JSON.stringify(carrinho));
            localStorage.setItem('pedidoExistente', 'Sim');
            this.router.navigate(['/pagamento','1']);
        } else {
            // verificar necessidade de implementar esta opção
        }
    }

    changeCurrent(item){
        this.currentDetalhes = item;
        console.log("current", this.currentDetalhes);
        /*this.currentDetalhes.items.forEach((value,i) =>{
            if(value.curso != null){
                this.cursoService.cursoById(value.curso.id).subscribe(apiResponse =>{    
                    console.log(apiResponse)            
                    value.curso.valor_liquido =Number(((apiResponse.data) as any).valor).toFixed(2);
                })
            }
        })*/
        
    }

    toNumber(value){
        return Number(value);
    }
}
