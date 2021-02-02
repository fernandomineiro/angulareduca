import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import { CursosService } from 'src/app/curso/cursos.service';
import { of } from 'rxjs';
import $ from 'jquery';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';
import { LoginService } from 'src/app/security/login/login.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
@Component({
  selector: 'app-card-trilha-conhecimento',
  templateUrl: './card-trilha-conhecimento.component.html',
  styleUrls: ['./card-trilha-conhecimento.component.scss']
})
export class CardTrilhaConhecimentoComponent implements OnInit {

  constructor(private shoppingCartService: ShoppingCartService, private cursosService: CursosService, private router: Router, private trilhasService: TrilhasService,  private loginService: LoginService, private modalWarning: ModalAvisoService) {
    PNotifyButtons; // Initiate the module. Important!
   }


  @Input() categoria: any
   
  @Input() favorites:any


  ngOnInit() {
    this.categoria.isFavorite = this.cursosService.checkIfCourseIsFavorite(this.categoria.id, localStorage.getItem('usuario_id'),this.favorites);
    console.log("teste", this.favorites);
  }

  addToCart(item){
    let categoria = 'Trilha de Conhecimento';
    var total = 0;
    if(localStorage.getItem('carrinho') != null)
      total = JSON.parse(localStorage.getItem('carrinho')).length
      
    this.shoppingCartService.addItem(item.titulo,item.id,item.valor_venda, item.icone , categoria,item.gratis)
    if(localStorage.getItem('carrinho') != null && total < JSON.parse(localStorage.getItem('carrinho')).length){
      PNotify.success({
        text: 'Item adicionado ao carrinho',
        delay:3000
      });
    }
    else{
      PNotify.error({        
        text: 'Este item já está no carrinho.',
        delay:3000
      });
    }

  }

  favoritar(course){
    if(!this.loginService.isLoggedIn()){
      this.modalWarning.openWarning('Você deve estar logado para Favoritar um curso');
      console.log("entrei");
      return;
    }
    let data = {
      fk_trilha:course.id,
      fk_usuario: localStorage.getItem('usuario_id')
    }
    this.trilhasService.recordAsFavorite(data, course.isFavorite.value).subscribe((apiResponse) => {
      if(apiResponse.success){
        if(course.isFavorite.value)
          course.isFavorite = of(false);
        else
          course.isFavorite = of(true);
      }else{
        PNotify.error({        
          text: 'Houve um erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
      }

      
    }); 
       
  }

  navigate(e,id){
    console.log(e,id);
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id': id }     
    };
    if(!$(e.target).hasClass('fa-heart')){
      console.log('entrei if');
      this.router.navigate(['/trilha-sobre/' + id])
    }
  }

}
