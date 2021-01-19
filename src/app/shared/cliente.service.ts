import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8888/cliente.php';
  
  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get(this.url);
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
      .pipe(catchError(this.handleError));
  }

  put(cliente: Cliente): Observable<any> {
    let payload = JSON.stringify(cliente);
    return this.http.put<Cliente>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  post(cliente: Cliente): Observable<any> {
    let payload = JSON.stringify(cliente);
    return this.http.post<Cliente>(this.url, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}