import { Component, OnInit, Inject } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ShoppingCartService } from '../shopping-cart.service';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { Aluno } from 'src/app/aluno/aluno.model';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { LoginService } from 'src/app/security/login/login.service';
import { FormBuilder } from '@angular/forms';
import { Validators, EmailValidator } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import $ from 'jquery';
import * as _ from 'underscore';
import { PaymentService } from 'src/app/shopping-cart/payment/payment.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import { forEach } from '@angular/router/src/utils/collection';
import { ParceirosService } from '../../home/parceiros/parceiros.service';
import { CursosService } from '../../curso/cursos.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/header/dialog/dialog.component';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';


@Component({
  selector: 'mt-payment',
  templateUrl: './payment.component.html',
  // preserveWhitespaces: true,
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  IMG_URL = environment.img_url;
  rowState = 'ready';

  formCadastro: FormGroup;
  aluno;
  submitted = false;
  success = false;
  error: string = '';
  apiResponse: any;
  loading: boolean = false;
  show: boolean = false;
  cartEmpty: boolean = false;
  cupomDesconto: any;
  items: any;
  assinatura: any[];
  step = -1;
  hasCurso;
  isAssinatura: boolean;
  parcelas = 1;
  currentPayment;
  errors: [];

  termosAccepted;
  termosComponentFlag: boolean = false;
  showErrorMessage: boolean = false;

  faculdades = [];
  cursos = [];
  estados = [];
  cidades = [];
  dialogResult;
  processandoPagamento: boolean = false;
  parcelasJuros
  juros
  maxParcelas = []

  constructor(
    private shoppingCartService: ShoppingCartService,
    private headerService: HeaderService,
    private router: Router,
    private alunoService: AlunoService,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private paymentService: PaymentService,
    private modalWarning: ModalAvisoService,
    private parceirosService: ParceirosService,
    private cursosService: CursosService,
    public dialog: MatDialog,
    private configuracoesStore: ConfiguracoesStore,
    private route: ActivatedRoute
  ) {

    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.checkIfHasItems();
  }


  validateCPF(c: FormControl) {
    if (c.value == undefined) {
      return;
    }

    const cpf = c.value.toString();
    return cpf.length >= 11 && cpf.length <= 14 ? null : {
      validateCPF: {
        valid: false,
        message: 'Informe um CPF válido'
      }
    };
  }

  isValidBirthdate(c: FormControl) {
    if (c.value == undefined || c.value == '') {
      return;
    }

    const birthdate = new Date(c.value);
    return Number(birthdate.getFullYear()) >= 1900 && birthdate < new Date() ? null : {
      validateBirthdate: {
        valid: false,
        message: 'Informe uma data de nascimento válida'
      }
    };
  }

  validateCEP(c: FormControl) {
    if (c.value == undefined) {
      return;
    }
    const cep = c.value.toString();
    return cep.length == 8 ? null : {
      validateCEP: {
        valid: false,
        message: 'Informe um CEP válido'
      }
    };
  }

  buscarCursos(idFaculdade) {
    this.cursosService.cursosPorFaculdade(idFaculdade).subscribe((apiResponse) => {
      this.cursos = apiResponse.items;
    });
  }

  buscarCidades() {
    this.alunoService.getCidades(this.formCadastro.value.fk_estado_id).subscribe((apiResponse) => {
      this.cidades = apiResponse.items;
    });
  }


  getMaxParcelas(){
    console.log("this.total()",this.total(),"this.cupom",this.cupomDesconto)
    var prov = this.total()- this.cupomDesconto.valor;
    var max = {parcela:'',percentual:''};
    if( this.parcelasJuros != undefined){
      max = this.parcelasJuros[0];
      this.parcelasJuros.forEach((value,i)=>{
       console.log("prov",prov,"Number(value.minimo)",Number(value.minimo))
        if(prov >= Number(value.minimo)){
          max = value;
        }
        if(_.findWhere(this.maxParcelas, {parcela: max.parcela}) == undefined)
          this.maxParcelas.push(max)
      })
    }    
    console.log("max",max)
    return max;
  }

  getJuros(){
    var juros;
    if(Number(this.parcelas) > 6)
      return juros = _.findWhere(this.maxParcelas, {parcela : this.parcelas}).percentual/100;
    return 0   
    
  }

  ngOnInit() {
    this.step = this.route.snapshot.params['passo'] == '1' ? 1 : 0;
    this.createForm(new Aluno());
    this.headerService.selectedItem.next('shopping');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.shoppingCartService.getJurosParcelamento().subscribe(apiResponse => {
      this.parcelasJuros = apiResponse[0]; 
      this.getMaxParcelas();         
    });


    this.parceirosService.getParceiros().subscribe((apiResponse) => {
      this.faculdades = apiResponse.items;
    });

    this.alunoService.getEstados().subscribe((apiResponse) => {
      this.estados = apiResponse.items;
    });

    this.alunoService.getById(Number(localStorage.getItem('usuario_id'))).subscribe(response => {
      this.aluno = response.data;

      this.formCadastro.patchValue({
        nome: this.aluno.nome,
        sobre_nome: this.aluno.sobre_nome,
        cnpjcpf: this.mask(this.aluno.cpf),
        rg: this.aluno.identidade,
        data_nascimento: this.aluno.data_nascimento,
        cep: this.aluno.cep,
        logradouro: this.aluno.logradouro,
        numero: this.aluno.numero,
        bairro: this.aluno.bairro,
        complemento: this.aluno.complemento,
        cidade: this.aluno.cidade,
        estado: this.aluno.estado,
        telefone_1: this.aluno.telefone_1,
        telefone_2: this.aluno.telefone_2,
        telefone_3: this.aluno.telefone_3,
        // universidade: this.aluno.universidade,
        // curso: this.aluno.curso,
        // semestre: this.aluno.semestre,
        // ra: this.aluno.matricula,
        fk_faculdade_id: this.aluno.fk_faculdade_id,
        fk_cidade_id: this.aluno.fk_cidade_id,
        fk_estado_id: this.aluno.fk_estado_id,
        fk_endereco_id: this.aluno.fk_endereco_id,
      });

      this.buscarCursos(this.aluno.fk_faculdade_id);

      if (this.aluno.fk_estado_id) {
        this.buscarCidades();
      }

      $('#cep').val(this.aluno.cep);
      $('#cpf').val(this.aluno.cpf);
      $('#rg').val(this.aluno.identidade);

      $('#telefone_1').val(this.aluno.telefone_1);
      $('#telefone_2').val(this.aluno.telefone_2);
      $('#telefone_3').val(this.aluno.telefone_3);

      this.hasCurso = false;
      if (this.aluno.curso_superior == 'sim') {
        this.hasCurso = true;
      }

      this.confirmarPagamento(true);

    });

    this.cupomDesconto = { nome: '', valor: 0 };
    if (localStorage.getItem('cupomCarrinho') !== null && localStorage.getItem('pedidoExistente') !== 'Sim') {
      this.cupomDesconto = JSON.parse(localStorage.getItem('cupomCarrinho'));
    }

    if (localStorage.getItem('pedidoExistente') === 'Sim') {
      if (localStorage.getItem('carrinho2') != null) {
        this.items = JSON.parse(localStorage.getItem('carrinho2'));
      }
    } else {
      if (localStorage.getItem('carrinho') != null) {
        this.items = JSON.parse(localStorage.getItem('carrinho'));
      }
    }

    if (_.findWhere(this.items, { item_categoria: 'Assinatura' }) != undefined) {
      this.isAssinatura = true;
    } else {
      this.isAssinatura = false;
    }
  }

  getCEP(cep: any, formCadastro: any) {
    const prov = this.modalWarning;
    this.alunoService.getEnderecoCep(cep).subscribe((apiResponse) => {
      if (apiResponse.success == true) {
        const endereco = apiResponse.items;
        this.alunoService.getCidades(endereco.ufId).subscribe((apiResponseCidade) => {
          this.cidades = apiResponseCidade.items;
          console.log("cidades", this.cidades);
          formCadastro.patchValue({
            logradouro: this.toProperCase(endereco.logradouro),
            cidade: this.toProperCase(endereco.localidade),
            estado: endereco.uf,
            bairro: this.toProperCase(endereco.bairro),
            fk_cidade_id: endereco.cidadeId,
            fk_estado_id: endereco.ufId,
            fk_endereco_id: endereco.id,
          });
        });
      }else{
        this.modalWarning.openWarning('CEP não encontrado')
        formCadastro.patchValue({
          logradouro:null,
          cidade: null,
          estado: null,
          bairro: null,
          fk_cidade_id: null,
          fk_estado_id: null,
          fk_endereco_id: null
        });
      }
        
    });



  }

  findCep(e) {
    const cep = e.target.value;
    this.getCEP(cep, this.formCadastro);
  }

  checkIfHasItems() {
    this.cartEmpty = true;
    if (localStorage.getItem('carrinho') != null) {
      if (JSON.parse(localStorage.getItem('carrinho')).length > 0) {
        this.cartEmpty = false;
      }
    }

    if (localStorage.getItem('pedidoExistente') === 'Sim') {
      if (localStorage.getItem('carrinho2') != null) {
        if (JSON.parse(localStorage.getItem('carrinho2')).length > 0) {
          this.cartEmpty = false;
        }
      }
    }
  }

  changeParcelas(e) {
    this.parcelas = Number(e.target.value);
  }

  createForm(formCadastro: any) {
    this.formCadastro = this.formBuilder.group({
      nome: ['', [Validators.required]],
      sobre_nome: ['', [Validators.required]],
      cnpjcpf: ['', [Validators.required, this.validateCPF]],
      rg: ['', [Validators.required]],
      data_nascimento: ['', [Validators.required, this.isValidBirthdate]],
      cep: ['', [Validators.required, this.validateCEP]],
      logradouro: [{ value: '', disabled: true }, [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: [{ value: '', disabled: true }, [Validators.required]],
      complemento: new FormControl(formCadastro.complemento),
      cidade: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: '', disabled: true }, [Validators.required]],
      telefone_1: new FormControl(),
      telefone_2: new FormControl(),
      telefone_3: new FormControl(),
      // universidade: new FormControl(),
      // curso: new FormControl(),
      // semestre: new FormControl(),
      // ra: new FormControl(),
      fk_faculdade_id: new FormControl(),
      fk_endereco_id: new FormControl(),
      fk_estado_id: new FormControl(),
      fk_cidade_id: new FormControl(),
    });
  }

  checkIfAreValid(isOnInit?): boolean {

    let isValid = true;

    if (this.step == 1) {
      if (!this.termosAccepted) {
        isValid = false;
      }
    }

    this.hasCurso = false;
    if ($('input[name="curso_superior"]:checked ').attr('id') == 'graduation_yes') {
      this.hasCurso = true;
    }

    if (this.formCadastro.status == 'INVALID' && this.hasCurso != undefined) {
      isValid = false;
    }

    if (this.hasCurso && $('#university').val() == '') {
      isValid = false;
    }

    if (this.hasCurso && $('#course').val() == '') {
      isValid = false;
    }

    if (this.hasCurso && $('#semester').val() == '') {
      isValid = false;
    }

    if (this.hasCurso && $('#ra').val() == '') {
      isValid = false;
    }
    if (this.formCadastro.get('telefone_1').value == '' &&
      this.formCadastro.get('telefone_2').value == '' &&
      this.formCadastro.get('telefone_2').value == '') {
      isValid = false;
      this.modalWarning.openWarning('É necessário informar ao menos um número de telefone')
    }

    if (!isValid) {
      this.step = 0;
    } else if (isOnInit) {
      this.step = 1;
    }

    return isValid;
  }

  confirmarPagamento(isOnInit?) {
    this.submitted = true;
    if (this.checkIfAreValid(isOnInit)) {
      this.loading = true
      this.submitted = true;
      if (this.step == 0) {
        const data = this.formCadastro.getRawValue();

        this.alunoService.update(data, localStorage.getItem('usuario_id')).subscribe((retorno) => {
          this.apiResponse = retorno;
          this.loading = true;

          if (this.apiResponse.success == true) {
            this.success = true;
            this.step = 1;
          } else {
            this.error = 'Houve erro ao salvar os dados!';
            this.modalWarning.openWarning('Erro ao salvar os dados');
          }
        });
      }
    } else {
      this.loading = false;
    }
  }

  pedidoConcluido() {

    // aprovando o pedido tem que salvar na tabela inscricao
    this.showErrorMessage = false;
    let isValid = true;
    if (!this.termosAccepted) {
      isValid = false;
      this.modalWarning.openWarning('Para continuar é necessário aceitar os Termos e Condições');
      return;
    }

    localStorage.setItem('data-pedido', JSON.stringify(new Date()));
    localStorage.setItem('opcao-pagamento', this.currentPayment);
    if (
      this.currentPayment == 'boleto' ||
      this.currentPayment == 'debito_online' ||
      _.findWhere(this.items, { item_categoria: 'Assinatura' }) != undefined
    ) {
      localStorage.setItem('total-pedido', 'R$ '+ ((this.total() - this.cupomDesconto.valor).toFixed(2)).toString().replace('.',','));      
    } else {
      localStorage.setItem('total-pedido',
        this.parcelas + ' x R$ ' + ((this.total() - this.cupomDesconto.valor + (this.total() * (this.getJuros())))/this.parcelas).toFixed(2).toString().replace('.',',')
      );     
    }
    localStorage.setItem('total-pedido2',
    (this.total() - this.cupomDesconto.valor).toFixed(2)
  );
    
    let obj;
    // tslint:disable-next-line:variable-name
    let order_id = localStorage.getItem('pedidoNo');
    if (this.currentPayment == 'boleto') {
      obj = {
        order_id: order_id,
        method: 'bank-slip'
      };
    } else if (this.currentPayment == 'debito_online') {
      obj = {
        order_id: order_id,
        method: 'debit'
      };
    } else if (this.currentPayment == 'cartao_de_credito') {
      if ($('#cartaoValidade').val() == '') {
        this.modalWarning.openWarning('Preencha a validade do cartão');
        return;
      } else if (!$('#cartaoValidade').val().includes('/')) {
        this.modalWarning.openWarning('Preencha a validade do cartão no formato mm/aa');
        return;
      } else if ($('#cartaoNome').val() == '') {
        this.modalWarning.openWarning('Preencha o nome do titular do cartão');
        return;
      } else if ($('#cartaoCPF').val() == '') {
        this.modalWarning.openWarning('Preencha o CPF do titular do cartão');
        return;
      } else if ($('#cartaoBirthdate').val() == '') {
        this.modalWarning.openWarning('Preencha a data de nascimento do titular do cartão');
        return;
      } else if ($('#cartaoCSC').val() == '') {
        this.modalWarning.openWarning('Preencha o CVV do cartão');
        return;
      } else if ($('#ccPhone').val() == '' || $('#ccPhone').val().length < 10 || $('#ccPhone').val().length > 11) {
        this.modalWarning.openWarning('Preencha o telefone apenas com números, podendo ser telefone fixo ou celular');
        return; 
      } else if ($('#cartaoDDD').val() == '' || $('#cartaoPhone').val() == '') {
        this.modalWarning.openWarning('Preencha o telefone');
        return;
      }

      const validade = $('#cartaoValidade').val().toString().split('/');

      obj = {
        order_id: order_id,
        method: 'credit-card',
        full_name: $('#cartaoNome').val(),
        birth_date: $('#cartaoBirthdate').val(),
        credit_card_number: $('#cartaoNumero').val().replace(/\s/g, ""),
        expiry_month: validade[0],
        expiry_year: validade[1],
        cvv: $('#cartaoCSC').val(),
        installment: $('#parcelamentoSelect').val(),
        document: $('#cartaoCPF').val(),
        ddd: $('#cartaoDDD').val(),
        phone: $('#cartaoPhone').val(),
      };
    } else if (this.currentPayment == 'pay_pal') {

    } else {
      this.modalWarning.openWarning('Selecione uma forma de pagamento');
      return;
    }

    if (this.isAssinatura) {
      this.paymentService.verificarAssinaturaAtiva(localStorage.getItem('usuario_id')).subscribe(response => {
        let timeout = 0
        if (response.status != 0) {
          this.openDialog('', response.alert);
          var interval = setInterval(() => {
            if (this.dialogResult == true) {
              clearInterval(interval);
              this.items.forEach(item => {
                obj.plan_id = item.item_id
                this.assinar(obj);
              });

            }

          }, 500);

        }else{
          this.items.forEach(item => {
            obj.plan_id = item.item_id
            this.assinar(obj);
          });
        }
      });
    } else {
      this.processandoPagamento = true;
      this.paymentService.processar(obj).subscribe(response => {
        this.processandoPagamento = false;
        if (response.link_print_bank_lip != null) {
          localStorage.setItem('pid',response.pid )
          window.open(response.link_print_bank_lip);
        }

        if (response.success != undefined) {
          localStorage.setItem('pid',response.pid )
          this.router.navigate(['/pedido-concluido/' + order_id]);

          if (localStorage.getItem('pedidoExistente') === 'Sim') {
            localStorage.setItem('carrinho2', '');
            localStorage.setItem('pedidoExistente', 'Não');
          }
        }
        if (response.error != undefined) {
          this.errors = response.error;
          this.showErrorMessage = true;
        }

        if (response.success != undefined && response.success.includes('https')) {
          localStorage.setItem('pid',response.pid )
          window.open(response.success);
        }
      });
    }
  }

  cancelaPagamento(event) {
    event.preventDefault();
    if (localStorage.getItem('pedidoExistente') === 'Sim') {
      localStorage.setItem('carrinho2', '');
      localStorage.setItem('pedidoExistente', 'Não');
    }
    this.router.navigate(['/carrinho']);
  }

  total(): number {
    return this.shoppingCartService.total();
  }
  assinar(obj) {
    this.paymentService.assinar(obj).subscribe(response => {
      this.processandoPagamento = false;
      if (response.link_print_bank_lip != null) {
        window.open(response.link_print_bank_lip);
      }

      if (response.success != undefined) {
        if (localStorage.getItem('pedidoExistente') === 'Sim') {
          localStorage.setItem('carrinho2', '');
          localStorage.setItem('pedidoExistente', 'Não');
        }
        this.router.navigate(['/pedido-concluido/' + obj.order_id]);
      }

      if (response.success != undefined && response.success.includes('https')) {
        window.open(response.success);
      }
      if (response.error != undefined)
        this.modalWarning.openWarning(response.error);
    });
  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  checkIfNumber(e) {
    /* console.log(e.target.value);
     if(Number.isNaN(Number(e.key))){
       
      console.log('entrei');
       e.target.value = '';
       console.log(e.target.value);
       return;
     }*/
  }

  cpfMask(event) {
    event.target.value = this.mask(event.target.value);
  }

  mask(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
  }

  termosCondicoesShow() {
    this.termosComponentFlag = true;
    window.scrollTo(0,0);
  }

  termosCondicoesHide() {
    this.termosComponentFlag = false;
    window.scrollTo(0,0);
  }

  voltar() {
    this.step = 0;
    this.success = false;
    this.loading = false;
  }

  openDialog(title, content): any {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: title, content: content }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogResult = result;

    });
  }
  toProperCase(str) {
      str = str.toLowerCase().split(' ');
      for (let i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(' ');
  }

  atribuirDDDeTelefoneCartaoCredito(){
    //task ED2-1039
    const phone = $('#ccPhone').val();
    if(phone == '' || phone.length < 10 || phone.length > 11){
      this.modalWarning.openWarning('O campo telefone não pode estar vazio, ou com menos de 10 digitos numérico ou, com mais de 11 dígitos numérico!');
      $('#ccPhone').focus();
      return false;
    }
    const ddd = phone.substring(0,2);
    const telefone = phone.substring(2);
    $('#cartaoDDD').val('');
    $('#cartaoDDD').val(ddd);
    $('#cartaoPhone').val('');
    $('#cartaoPhone').val(telefone);
  }
  
  validarTamanhoCampo(){
    let fieldSize = $('#ccPhone').val().length;
    if(fieldSize > 11){
      $('#ccPhone').val($('#ccPhone').val().substring(0,11));
    }else if(fieldSize == 10 || fieldSize == 11){
      const ddd = $('#ccPhone').val().substring(0,2);
      const telefone = $('#ccPhone').val().substring(2);
      $('#cartaoDDD').val('');
      $('#cartaoDDD').val(ddd);
      $('#cartaoPhone').val('');
      $('#cartaoPhone').val(telefone);
    }
  }

}




