import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from '../core/api-service';
import { AppConfigService } from '../core/config.service';


import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})

export class ProductoService extends ApiService<Producto>{
  path = "producto.php";
  constructor(
    protected http: HttpClient,
    protected app: AppConfigService
  ) {
    super("producto.php", http, app);
  }
/*
  get(): Observable<any> {
    return this.http.get(this.url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  put(producto: Producto): Observable<any> {
    let payload = JSON.stringify(producto);
    return this.http.put<Producto>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  post(producto: Producto): Observable<any> {
    let payload = JSON.stringify(producto);
    return this.http.post<Producto>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
*/
}
