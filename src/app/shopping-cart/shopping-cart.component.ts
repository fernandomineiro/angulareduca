import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {trigger, state, style, transition, animate, keyframes} from '@angular/animations'

import {ShoppingCartService} from './shopping-cart.service'
import { Observable, from } from 'rxjs'
import { HeaderService } from 'src/app/header/header.service';

import { PedidoService } from 'src/app/pedido/pedido.service';
import { LoginService } from 'src/app/security/login/login.service';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import $ from 'jquery';
import { CursosService } from 'src/app/curso/cursos.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'mt-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  // preserveWhitespaces: true,
  animations: [
    trigger('row', [
      state('ready', style({opacity: 1})),
      transition('void => ready', animate('300ms 0s ease-in', keyframes([
        style({opacity:0, transform: 'translateX(-30px)', offset:0}),
        style({opacity:0.8, transform: 'translateX(10px)', offset:0.8}),
        style({opacity:1, transform: 'translateX(0px)', offset:1})
      ]))),
      transition('ready => void', animate('300ms 0s ease-out', keyframes([
        style({opacity:1, transform: 'translateX(0px)', offset:0}),
        style({opacity:0.8, transform: 'translateX(-10px)', offset:0.2}),
        style({opacity:0, transform: 'translateX(30px)', offset:1})
      ])))
    ])
  ]
})
export class ShoppingCartComponent implements OnInit {
  IMG_URL = environment.img_url
  apiResponse: any;
  loading: boolean = false;
  error:string = '';
  rowState = 'ready'
  items:any;
  favorites2
  cupom = {
    id: null,
    nome:'',
    valor:0,
    title:''
  }
  juros
  parcelasJuros
  cursosAluno
  cupomValidated:boolean=false;
  successCupom:boolean;
  isAssinatura:boolean;
  message: any;
  favorites = []
  cursosAlunoPresencial
  cursosAlunoRemotos
  slide2Config = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 940,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      }
    ]
  }
  constructor(private shoppingCartService: ShoppingCartService, 
              private headerService: HeaderService,
              private pedidoService: PedidoService,
              private router: Router,
              private loginService: LoginService,
              private cursosService: CursosService,
              private modalWarning: ModalAvisoService,
              private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

    this.headerService.selectedItem.next('shopping');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.items = this.shoppingCartService.carregaCarrinho();

    if (localStorage.getItem('cupomCarrinho') != null) {
      localStorage.removeItem('cupomCarrinho');
    }

    this.shoppingCartService.getJurosParcelamento().subscribe(apiResponse => {
      this.parcelasJuros = apiResponse[0];
      // console.log("this.parcelasJuros",this.parcelasJuros)
      // console.log("apiResponse[0];",apiResponse[0])
    });

    setInterval(() => {
      const shoppingCart = JSON.parse(localStorage.getItem('carrinho'));
      if (shoppingCart && this.items.length < shoppingCart.length) {
        this.items = this.shoppingCartService.carregaCarrinho();
      }

      this.isAssinatura = false;
      if (_.findWhere(this.items, {item_categoria: 'Assinatura'}) != undefined) {
        this.isAssinatura = true;
      }
    }, 300);

    this.cursosService.getFavorites(Number(localStorage.getItem('usuario_id')))
      .subscribe((ApiResponse) => {
        this.favorites2 = ApiResponse
        _.each(ApiResponse.items, element => {        
          this.favorites.push(element);
        });
        var prov;
        this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
          prov = cursosAluno.items;
          this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoPresencial) => {
            this.cursosAlunoPresencial = cursosAlunoPresencial.items;
            this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoRemoto) => {
              this.cursosAlunoRemotos = cursosAlunoRemoto.items;
              this.cursosAluno = prov.concat(this.cursosAlunoPresencial, this.cursosAlunoRemotos)
              //console.log("cursossss", this.cursosAluno)
            });
            
          });
          

        });

        //console.log("favorites", this.favorites)
      }
      )
  }

  isLoggedIn() : boolean {
    return this.loginService.isLoggedIn()
  }  

  

  clear() {
    this.items = this.shoppingCartService.clear()
  }

  removeItem(posicao: any) {
    this.items = this.shoppingCartService.removeItem(posicao,this.items);

  }

  
  total(): number {    
      return this.shoppingCartService.total();   

  }  
  
  gerarPedido() {
    let imposto_percentual = 6;
    let valor_bruto = this.shoppingCartService.total();
    let valor_imposto = (valor_bruto / 100) * imposto_percentual;
    let valor_liquido = valor_bruto - valor_imposto;

    let items = this.shoppingCartService.carregaCarrinho();
      
    let data = {
        'pedido': {
          'usuario': localStorage.getItem('usuario_id'),
          'valor': valor_bruto,
          'desconto': this.cupom.valor,
          'cupom':  this.cupom.nome,
          'fk_cupom': this.cupom.id
        },
        'items':[]
    };
    //console.log("items",items);
    items.forEach(element => {
      var id;
      if(element.item_categoria.includes('Curso')){
        data.items.push({
          valor:element.item_valor,
          desconto:0,
          id_curso:element.item_id,
          id_evento:null,
          id_trilha:null,
          id_agenda_evento:null,
          id_assinatura:null
        })
      }else if(element.item_categoria.includes('Assinatura')){
        data.items.push({
          valor:element.item_valor,
          desconto:0,
          id_curso:null,
          id_evento:null,
          id_trilha:null,
          id_agenda_evento:null,
          id_assinatura:element.item_id
        })
      }else if(element.item_categoria.includes('Trilha')){
        data.items.push({
          valor:element.item_valor,
          desconto:0,
          id_curso:null,
          id_evento:null,
          id_agenda_evento:null,
          id_trilha:element.item_id,
          id_assinatura:null
        })
      }else{
        data.items.push({
          valor: element.item_valor,
          desconto:0,
          id_curso:null,
          id_evento: element.item_pai,
          id_agenda_evento: element.item_id,
          id_trilha:null,
          id_assinatura:null
        })
      }

    });

    if (this.loginService.getPerfil() != 14 && this.loginService.isLoggedIn()) {
      this.modalWarning.openWarning(
          'Caro ' + localStorage.getItem('nome') +
          ', para efetuar essa compra é necessário criar uma conta como aluno. Para isso, acesse no menu do site "Faça seu Cadastro" e' +
          ' preenche os dados. É necessário outra conta de e-mail.'
      );
      return;
    }
    console.log(data.items);

    let valor_desconto = valor_bruto;
    if (this.cupom && this.cupom.valor) {
        valor_desconto = valor_desconto - this.cupom.valor;
    }
    console.log('Valor desconto', valor_desconto);
    if (valor_liquido == 0 || this.shoppingCartService.checkIfHasGratis() || valor_desconto == 0) {
        this.shoppingCartService.verificaCadastro(Number(localStorage.getItem('usuario_id'))).subscribe(e => {
            if (!e.success) {
                this.modalWarning.openWarning('Você precisa completar o cadastro para acessar esse item');
                this.router.navigate(['/editar']);
                return;
            } else {
                this.criarPedido(data);
            }
        });
    } else {
        this.criarPedido(data);
    }
  }

  criarPedido(data) {
      this.pedidoService.create(data).subscribe((retorno) => {
          this.apiResponse = retorno;
          this.loading = false;

          if (this.apiResponse.success == true) {
              this.error = '';
              localStorage.setItem('pedidoAberto', 'Não');
              this.router.navigate(['/pagamento']);
              localStorage.setItem('pedidoNo', this.apiResponse.data.id);
              if (retorno.redirect != undefined ) {
                  localStorage.removeItem('carrinho');
                  this.headerService.changeShoppingCartAmount.next(0);
                  this.router.navigate([retorno.redirect]);
              }
          } else {
              this.error = retorno.error;
          }
      });
  }

  pedidoAberto() {
    // console.log('Pedido Aberto');
    localStorage.setItem('pedidoAberto', 'Sim');
  }

  criaItemsValidaCupom(items) {
      const data = {
          cursos: [],
          trilhas: [],
          eventos: [],
          assinaturas: []
      }
      items.forEach(element => {
          if (element.item_categoria.includes('Curso')) {
              data.cursos.push(element.item_id);
          } else if (element.item_categoria.includes('Assinatura')) {
              data.assinaturas.push(element.item_id);
          } else if (element.item_categoria.includes('Trilha')) {
              data.trilhas.push(element.item_id);
          } else {
              data.eventos.push(element.item_pai);
          }

      });
      return data;
  }

  validateCupom() {
    const usuario = Number(localStorage.getItem('usuario_id'))
    if (!usuario) {
        this.modalWarning.openWarning('Você precisa estar logado para validar o cupom');
        return;
    }
    const cupom = {
        valor: this.total(),
        codigo_cupom: $('#pedido_cupom').val(),
        items: this.criaItemsValidaCupom(this.shoppingCartService.carregaCarrinho()),
        faculdade: Number(localStorage.getItem('faculdade')),
        aluno: usuario
    }

    if ($('#pedido_cupom').val() == '') {
        this.modalWarning.openWarning('Favor informar o código do cupom');
        return;
    }

    this.shoppingCartService.validateCupom(cupom).subscribe(result => {
        if (result.success) {
            this.cupom.valor = result.data.valor;
            this.cupom.nome = result.data.codigo_cupom;
            this.cupom.title = result.data.titulo;
            this.cupom.id = result.data.id;
            this.successCupom = true;
            this.message = null;
            localStorage.setItem('cupomCarrinho', JSON.stringify(this.cupom));
        } else {
            $('#pedido_cupom').val(null);
            localStorage.removeItem('cupomCarrinho');
            this.cupom = {
                nome: '',
                valor: 0,
                title: '',
                id: null
            }
            this.successCupom = false;
            if (result.messages) {
                console.log(result.messages);
                this.message = result.messages;
            }
        }
        this.cupomValidated = true;
    });
  }

  getMaxParcelas(){
    var prov = this.total()- this.cupom.valor;
    var max = {parcela:0,percentual:0};
    if( this.parcelasJuros != undefined){
      max = this.parcelasJuros[0];
      this.parcelasJuros.forEach((value,i)=>{
        if(prov >= Number(value.minimo)){
          max = value;
        }
      })
      if(max.parcela <= 6){
        max.percentual = 0
      }
    }    
    this.juros = Number(max.percentual);
    return max;
  }
}
