import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, AfterViewInit {

  productos : Producto[] = [];
  productoSelected = new Producto();

  dataSource = new MatTableDataSource<Producto>();
  
  mostrarForm = false;
  form = new FormGroup({});

  constructor( private productoService: ProductoService, private formBuilder: FormBuilder, public dialog: MatDialog ) { }

  @ViewChild(MatSort) sort!: MatSort;
  //atributo donde almaceno los nombres para las propiedades de las columnas en matTable
  columnas: string[] = ['prodId', 'prodDescripcion', 'prodPrecio', 'acciones']; 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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
        this.actualizarTabla();
      } 
    )
  }

  actualizarTabla() {
    this.dataSource.data = this.productos;
    this.dataSource.sort = this.sort;
  }

  agregar() {
    this.form.reset();
    this.productoSelected = new Producto();
    this.mostrarForm= true;
  }


  delete(row: Producto) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.productoService.delete(row.prodId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.productos = this.productos.filter((producto) => {
              if (producto.prodId != row.prodId) {
                return true
              } else {
                return false
              }
            });

            this.actualizarTabla();
          });
      }
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
          this.actualizarTabla();
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
