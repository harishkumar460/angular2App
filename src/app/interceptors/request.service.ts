import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class RequestService implements HttpInterceptor{

  constructor() { }
  intercept(request: HttpRequest <any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    request =request.clone({headers: request.headers.set('xTokend', `x0010`)});
     return next.handle(request);
  }
}
