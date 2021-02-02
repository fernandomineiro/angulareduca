import { CartItem } from './cart-item.model';
import { Curso } from '../curso/curso.model';

import { Injectable } from '@angular/core';

import { NotificationService } from '../shared/messages/notification.service'
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { Assinatura } from '../assinaturas/assinatura.model';

import * as _ from 'underscore';
import { HttpClient } from '@angular/common/http';
import { ADDRESS_API, ApiResponse } from '../app.api';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import { HeaderService } from 'src/app/header/header.service';
import {CursosService} from '../curso/cursos.service';
import {LoginService} from '../security/login/login.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class ShoppingCartService {
    items: any = []

    // cupom para teste DEZEMBRO-10
    constructor(
        private notificationService: NotificationService,
        private http: HttpClient,
        private modalWarning: ModalAvisoService,
        private headerService: HeaderService,
        private cursosService: CursosService,
        private loginService: LoginService,
    ) {
        // tslint:disable-next-line:no-unused-expression
        PNotifyButtons; // Initiate the module. Important!
    }

    carregaCarrinho() {        
        var items = [];
        if (localStorage.getItem('carrinho') != null) {           
            items = JSON.parse(localStorage.getItem('carrinho'));
            this.headerService.changeShoppingCartAmount.next(items.length);
            items = this.formataCarrinho(items);
        }
        return items;
    }

    formataCarrinho(items) {
        items.forEach(element => {
            element.item_valor = Number(element.item_valor);
        });
        return items;

    }

    addItem(itemNome, itemId, itemValor, itemImagem?, itemCategoria?, itemGratis?, itemPai?) {

        if (this.loginService.getPerfil() != 14 && this.loginService.isLoggedIn()) {

            this.modalWarning.openWarning(
                'Caro ' + localStorage.getItem('nome') +
                ', para efetuar essa compra é necessário criar uma conta como aluno. Para isso, acesse no menu do site ' +
                '"Faça seu Cadastro" e' +
                ' preenche os dados. É necessário outra conta de e-mail.'
            );
            return;
        }

        const obj = {
            item_nome: itemNome,
            item_id: itemId,
            item_categoria: itemCategoria,
            item_valor: itemValor,
            item_imagem: itemImagem,
            item_gratis : itemGratis,
            item_pai: itemPai
        };

        this.cursosService.checkIfCourseHasWaitingPayments(itemId, localStorage.getItem('usuario_id')).subscribe(apiResponse => {
            if (apiResponse.success) {
                let carrinho = [];
                if (localStorage.getItem('carrinho') != null) {
                    carrinho = JSON.parse(localStorage.getItem('carrinho'));
                }
                // tslint:disable-next-line:only-arrow-functions
                const result = _.find(carrinho, function (item) {
                    return item.item_categoria == itemCategoria && item.item_id == itemId;
                });
                const findGratis = _.findWhere(carrinho, {item_gratis: 1});
                if(findGratis != undefined || (obj.item_gratis == 1 && carrinho.length)){                  
                        this.modalWarning.openWarning('Não é possível adquirir um item grátis enquanto já houver outros itens no seu carrinho');
                        return;
                }
                const hasAssinatura = _.findWhere(carrinho, { item_categoria: 'Assinatura' });
                if (result == undefined) {
                    if (itemCategoria == 'Assinatura') {
                        if (hasAssinatura == undefined && carrinho.length > 0) {
                            // tslint:disable-next-line:max-line-length
                            this.modalWarning.openWarning('Não é possível comprar Assinatura e Curso ao mesmo tempo. Finalize a compra atual no carrinho de compras ou remova os cursos adicionados para comprar uma assinatura');
                            return;
                        }
                    } else {
                        if (hasAssinatura != undefined && carrinho.length > 0) {
                            // tslint:disable-next-line:max-line-length
                            this.modalWarning.openWarning('Não é possível comprar Assinatura e Curso ao mesmo tempo. Finalize a compra atual no carrinho de compras ou remova os cursos adicionados para comprar uma assinatura');
                            return;
                        }
                    }

                    carrinho.push(obj);
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    PNotify.success({
                        text: 'Item adicionado ao carrinho',
                        delay:3000
                    });
                }
                this.headerService.changeShoppingCartAmount.next(JSON.parse(localStorage.getItem('carrinho')).length);
            } else {
                this.modalWarning.openWarning('Existe um pedido com esse curso em aberto, por favor, finalize o pedido!');
            }
           
            
        });
    }

    removeItem(posicao, items) {
        if (localStorage.getItem('carrinho') != null) {
            const carrinho = JSON.parse(localStorage.getItem('carrinho'));
            carrinho.splice(posicao, 1);
            items.splice(posicao, 1)
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
        }
        this.headerService.changeShoppingCartAmount.next(JSON.parse(localStorage.getItem('carrinho')).length);
        return items;
    }

    total(): number {
        var total = 0;
        if (localStorage.getItem('pedidoExistente') === 'Sim') {
            if (localStorage.getItem('carrinho2') != null) {
                var carrinho = JSON.parse(localStorage.getItem('carrinho2'));
                carrinho.forEach(element => {
                    if(element.item_valor != null && element.item_valor != null)
                        total += Number(element.item_valor);
                });
            }
        } else {
            if (localStorage.getItem('carrinho') != null) {
                var carrinho = JSON.parse(localStorage.getItem('carrinho'));
                carrinho.forEach(element => {
                    if(element.item_valor != null && element.item_valor != null)
                        total += Number(element.item_valor);
                });
            }
        }
        return total;
    }

    clear() {
        if (localStorage.getItem('carrinho') != null) {
            localStorage.removeItem('carrinho');
        }
        return [];
    }

    validateCupom(data): Observable<any> {
        //return this.http.get(`${ADDRESS_API}/api/cupom/validar`);
        return this.http.post<ApiResponse>(`${ADDRESS_API}/api/cupom/validar`, data, httpOptions);
        //return this.http.get<any>("../assets/modelos json/cupomDesconto.json") ;   
    }

    itemWasAdded(item) {
        var found;
        if (localStorage.getItem('carrinho') != null) {
            var carrinho = JSON.parse(localStorage.getItem('carrinho'));
            found = _.findWhere(carrinho,{item_id:item.id});
            return found == undefined ? false : true;
        }else{
            return false;
        }

    }

    getJurosParcelamento(): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/wirecard/installment-fee`);
    }

    checkIfHasGratis(){
        let carrinho = [];
        if (localStorage.getItem('carrinho') != null) {
            carrinho = JSON.parse(localStorage.getItem('carrinho'));
        }
        const findGratis = _.findWhere(carrinho, {item_gratis: 1});
        if(findGratis != undefined)
            return true;
        return false;
    }

    verificaCadastro(id: number): Observable<any> {
        return this.http.get<any>(`${ADDRESS_API}/api/aluno/verifica-cadastro-completo/${id}`);
    }

}
