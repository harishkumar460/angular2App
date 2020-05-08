import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';
import { FirstComponent } from './feature/first/first.component';
import { RequestService } from './interceptors/request.service';
import { ResponseService } from './interceptors/response.service';
import { RoutingModule } from './routing/routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FeatureModule,
    HttpClientModule,
    RoutingModule,
    RouterModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass: ResponseService, multi: true}//,
              /*{provide:HTTP_INTERCEPTORS, useClass: RequestService, multi: true}*/],
  entryComponents: [AppComponent, FirstComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { 

  ngDoBootstrap(appRef: ApplicationRef) {
    let ele= document.createElement('app-root');
    document.body.appendChild(ele);
    appRef.bootstrap(AppComponent);
  }
}
