import { Component, OnInit } from '@angular/core';
import { ParceirosService } from './parceiros.service';
import { Parceiro } from './parceiros.model';
import { environment } from 'src/environments/environment';
import { ViewChild } from '@angular/core';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.scss']
})
export class ParceirosComponent implements OnInit {
  IMG_URL = environment.img_url
  allParceiros: any[]

  @ViewChild('slickModal') slickModal;

  @Inject('isMobile') isMobile: boolean;

  constructor(private parceirosService: ParceirosService) { }
  slide2Config = {

    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 7,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1219,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      }      
    ]
  }


  ngOnInit() {
    console.log('isMobile', this.isMobile)
    try {

      this.parceirosService.getParceiros().subscribe((ApiResponse) => {
        this.allParceiros = ApiResponse.items;

      });






    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

  }
}
