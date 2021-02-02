import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { ConfiguracoesStore } from './stores/configuracoes.store';

// declare ga as a function to set and sent the events
declare let gtag: Function;
declare let ga: Function;
declare let fbq: Function;

@Component({
  selector: 'mt-app',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent implements OnInit {
  title = 'Educaz 2.0';

  constructor(
      public router: Router,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

      this.configuracoesStore.state$.subscribe(state => {
          if (state.configuracao.ga || state.configuracao.facebook) {
              // subscribe to router events and send page views to Google Analytics
              this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {

                      if (state.configuracao.ga) {
                          ga('set', 'page', event.urlAfterRedirects);
                          ga('send', 'pageview');

                          console.log('ga', event.urlAfterRedirects);
                      }

                      if (state.configuracao.facebook) {
                          fbq('track', 'PageView', {
                              page: event.urlAfterRedirects
                          });

                          console.log('fbq | track', event.urlAfterRedirects);
                      }
                  }
              });
          }
      });
  }

  scrollTop(event) {
    window.scroll(0, 0);
  }
}
