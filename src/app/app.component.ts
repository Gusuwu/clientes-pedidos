import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Producto } from './shared/producto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pedidos';
}
