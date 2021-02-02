import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssinaturaService } from 'src/app/assinaturas/assinatura.service';
import { Assinatura } from 'src/app/assinaturas/assinatura.model';
import { HeaderService } from 'src/app/header/header.service';
import { ShoppingCartService } from '../shopping-cart/shopping-cart.service';
import { environment } from '../../environments/environment';
import { Input } from '@angular/core';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
    selector: 'app-assinatura',
    templateUrl: './assinaturas.component.html',
    styleUrls: ['./assinatura.component.css']
})
export class AssinaturaComponent implements OnInit {

    constructor(
        private assinaturaService: AssinaturaService,
        private shoppingCartService: ShoppingCartService,
        private route: ActivatedRoute,
        private router: Router,
        private headerService: HeaderService,
        private configuracoesStore: ConfiguracoesStore,
    ) { }

    assinaturas: Assinatura[];
    hide = true;
    @Input()
    isHome;


    ngOnInit() {

        if (this.isHome != true) {

            this.headerService.selectedItem.next('assinaturas');
            this.configuracoesStore.state$.subscribe(state => {
                const confNavColor =
                    state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
                this.headerService.changeNavColor.next(confNavColor);
            });

            this.headerService.getBanner(environment.faculdade_id, 'assinaturas').subscribe((ApiResponse) => {
                this.headerService.changeBanner.next(ApiResponse.items);
            });
        }
       
        try {

            this.assinaturaService.getAssinaturas().subscribe((assinaturas) => {
                this.assinaturas = assinaturas.items;
            });

        } catch (error) {
            console.log('==== error ====');
            console.log(error);
        }
    }

    inserirNoCarrinho(item) {
        const categoria = 'Assinatura';
        this.shoppingCartService.addItem(item.titulo, item.id, item.valor_de, undefined, categoria, item.gratis);
        this.router.navigate(['/carrinho']);
    }
}
