import {Component, OnInit, Renderer2, Inject, OnDestroy} from '@angular/core';

import { ShoppingCartService } from '../shopping-cart.service'
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { PedidoService } from 'src/app/pedido/pedido.service';
import * as _ from 'underscore';
import { ConfiguracoesStore } from '../../stores/configuracoes.store';
import {SubSink} from 'subsink';

@Component({
  selector: 'mt-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit, OnDestroy {

  IMG_URL = environment.img_url
  rowState = 'ready'
  nomeAluno;
  numeroPedido:any;
  dataPedido;
  tipoPagamento;
  valorTotal;
  cursosCarrinho;
  pedidos;
  pedidoPago = false;
  subs = new SubSink();
  linkBoleto = ''

  constructor(
      private shoppingCartService: ShoppingCartService,
      private headerService: HeaderService,
      private route: ActivatedRoute,
      private router: Router,
      private _renderer2: Renderer2,
      private pedidosService: PedidoService,
      private configuracoesStore: ConfiguracoesStore,
      @Inject(DOCUMENT) private _document: Document
  ) { }

  ngOnInit() {

    let script = this._renderer2.createElement('script');
    script.type = `application/ld+json`;
    script.text = `
            window._st_account = 5825;
            window._cv_data = {
              'order_id':`+localStorage.getItem('pid')+`,      // Número do pedido
              'valor': `+localStorage.getItem('total-pedido2')+`         // Valor do pedido
            };            
            (function () {
              var ss = document.createElement('script');
              ss.type = 'text/javascript';
              ss.async = true;
              ss.src = '//app.shoptarget.com.br/js/tracking.js';
              var sc = document.getElementsByTagName('script')[0];
              sc.parentNode.insertBefore(ss, sc);
            })();
        `;

    this._renderer2.appendChild(this._document.body, script);

    this.headerService.selectedItem.next('shopping');

    this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ?
              state.configuracao.tiposCursosAtivos.header_secundario :
              '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.subs.sink =
        this.pedidosService.getPedidosByAlunoId(
            Number(localStorage.getItem('usuario_id'))
        ).subscribe((ApiResponse) => {
          this.pedidos = ApiResponse.items;
          this.checkPedido();
        });

    if (localStorage.getItem('carrinho') == null) {
      this.router.navigate(['/']);
    }

    this.nomeAluno = localStorage.getItem('nome');
    this.numeroPedido = this.route.snapshot.params['id'];
    this.dataPedido = new Date(JSON.parse(localStorage.getItem('data-pedido')));
    this.tipoPagamento = localStorage.getItem('opcao-pagamento');
    this.valorTotal = localStorage.getItem('total-pedido');
    this.cursosCarrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (this.tipoPagamento.includes('credito')) {
      this.tipoPagamento = 'Cartão de crédito';
    } else if(this.tipoPagamento.includes('debito')) {
      this.tipoPagamento = 'Débito online';
    } else {
      this.tipoPagamento = 'Boleto'
    }

    localStorage.removeItem('carrinho');
    localStorage.removeItem('pedidoNo');
    localStorage.removeItem('total-pedido');
    localStorage.removeItem('opcao-pagamento');
    localStorage.removeItem('data-pedido');

    this.headerService.changeShoppingCartAmount.next(0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  checkPedido(){
    var found = _.findWhere(this.pedidos, { id:Number(this.numeroPedido) });
    this.pedidoPago = found != undefined && found.status_titulo.includes('Pago');

    this.valorTotal = found.valor_bruto;
    this.dataPedido = found.criacao;
    this.cursosCarrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (found.forma_pagamento == 'credito') {
      this.tipoPagamento = 'Cartão de crédito';
    } else if(found.forma_pagamento == 'debito') {
      this.tipoPagamento = 'Débito online';
    } else {
      this.tipoPagamento = 'Boleto'
      this.linkBoleto = found.link_boleto

      let cursosCarrinho = [];

      found.items.forEach((curso) => {
          if (curso.trilha) {
            cursosCarrinho.push({
              item_id: curso.trilha.id,
              item_categoria: curso.trilha.id,
              item_imagem: curso.trilha.titulo,
              item_nome: curso.trilha.titulo
            })
          }
      })

      this.cursosCarrinho = cursosCarrinho
    }
    /**
     *
     * assinatura: null
     curso: null
     data_atualizacao: null
     data_criacao: null
     evento: null
     fk_agenda_evento: null
     fk_assinatura: null
     fk_curso: null
     fk_evento: null
     fk_pedido: 30990
     fk_produto_externo_id: null
     fk_trilha: 18
     id: 30105
     status: 1
     trilha: {id: 18, titulo: "Carola - trilha", descricao: "<p>trilha da carole</p>", valor: "799.80",…}
     valor_bruto: "599.00"
     valor_desconto: "0.00"
     valor_imposto: "97.82"
     valor_liquido: "501.18"

     assinatura: null
     curso: {id: 604, titulo: "Ao vivo III", slug_curso: "ao-vivo-iii",…}
     data_atualizacao: null
     data_criacao: null
     evento: null
     fk_agenda_evento: null
     fk_assinatura: null
     fk_curso: 604
     fk_evento: null
     fk_pedido: 31017
     fk_produto_externo_id: null
     fk_trilha: null
     id: 30134
     status: 1
     trilha: null
     valor_bruto: "150.00"
     valor_desconto: "0.00"
     valor_imposto: "24.50"
     valor_liquido: "125.50"


     * assinaturas: []
     atualizacao: "2020-08-04 17:33:51"
     codigo_cupom: null
     cpf: "632.965.450-69"
     criacao: "2020-08-04 17:33:51"
     data_compra_externa: null
     email: "ricardorussojr@hotmail.com"
     fk_atualizador_id: null
     fk_criador_id: null
     fk_cupom: null
     fk_faculdade: 7
     fk_usuario: 16177
     forma_pagamento: null
     id: 31022
     id_wirecard: null
     items: [{id: 30143, valor_bruto: "29.90", valor_desconto: "0.00", valor_imposto: "4.88",…}]
     link_boleto: null
     metodo_pagamento: null
     pid: "04082020-31022-16177"
     rg: "32.125.125-SP"
     status: 1
     status_cor: "#ffff00"
     status_titulo: "Aguardando Pagamento"
     telefone: null
     tipo_cupom_desconto: null
     usuario: "Ricardo Teste"
     valor_bruto: "29.90"
     valor_cupom: null
     valor_desconto: "0.00"
     valor_imposto: "4.88"
     valor_liquido: "25.02"
     */
  }

}
