import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpResponse, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseService implements HttpInterceptor{

  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     return next.handle(request).pipe(map(res => {
        console.log('res '+res);
        if(res instanceof HttpResponse) {
          res.body.updateResponse='Testing response update';
          return res;
        }
       }));
  }
}
