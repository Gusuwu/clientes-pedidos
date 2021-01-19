import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos : Producto[] = [];
  productoSelected = new Producto();
  
  mostrarForm = false;
  form = new FormGroup({});

  constructor( private productoService: ProductoService, private formBuilder: FormBuilder ) { }

  //atributo donde almaceno los nombres para las propiedades de las columnas en matTable
  columnas: string[] = ['id', 'descripcion', 'precio', 'editar', 'borrar'];

  //obtener una referencia a la tabla usando viewchild para acceder a la tabla y enviar datos a dataSource
 

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      prodId: [''],
      prodDescripcion: ['', Validators.required],
      prodPrecio: ['', Validators.required],
      prodBorrado: [''],
      prodFechaAlta: ['']
    });

    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
        console.log(productos);
      } 
    )
  }

  agregar() {
    this.form.reset();
    this.productoSelected = new Producto();
    this.mostrarForm= true;
  }


  delete(row: Producto) {
    this.productoService.delete(row.prodId)
      .subscribe(() => {
        this.productos = this.productos.filter((x) => {
          if (x.prodId != row.prodId) {
            return true
          } else {
            return false
          }
        });
      });
  }

  edit(seleccionado: Producto) {
    this.mostrarForm= true;
    this.productoSelected = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.productoSelected, this.form.value);

    //Para asignar uno por uno sin usar el assing.
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;


    if (this.productoSelected.prodId) {
      this.productoService.put(this.productoSelected)
        .subscribe((producto) => {
          this.mostrarForm = false;
        });

    } else {
      this.productoService.post(this.productoSelected)
        .subscribe((producto) => {
          this.productos.push(producto);
          this.mostrarForm = false;
        });

    }

  }

  aceptar(){
    this.mostrarForm  = false;
  }

  cancelar(){
    this.mostrarForm  = false;
  }

}
