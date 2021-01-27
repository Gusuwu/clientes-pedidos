import { findLast } from '@angular/compiler/src/directive_resolver';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { DatosService } from '../shared/datos.service';
import { PedidoDetalle } from '../shared/pedido-detalle';
import { PedidoDetalleService } from '../shared/pedido-detalle.service';
import { Producto } from '../shared/producto';
import { ProductoService } from '../shared/producto.service';


@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetallesComponent implements OnInit {

  @Input() pediId!: number;

  detalles: PedidoDetalle[] = [];
  seleccionado = new PedidoDetalle();

  columnas: string[] = ['prodDescripcion', 'detaCantidad', 'detaPrecio', 'acciones'];
  dataSource = new MatTableDataSource<PedidoDetalle>();


  form = new FormGroup({});
  mostrarFormulario = false;

  productos: Producto[] = [];
  detaIdNew: number = -1;
  

  constructor(private pedidoDetalleService: PedidoDetalleService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public datosService: DatosService) { }


  ngOnInit(): void {

    //formulario inicializado
    this.form = this.formBuilder.group({
      detaId: [''],
      detaPediId: [''],
      detaProdId: ['', Validators.required],
      detaCantidad: [''],
      detaPrecio: [''],
      detaBorrado: [''],
      detaFechaAlta: [''],
      prodDescripcion: ['']
    });

    // Carga de pedidos detalles
    this.pedidoDetalleService.get(`detaPediId=${this.pediId}`).subscribe(
      (pedidoDetalles) => {
        this.datosService.detalles = pedidoDetalles;
        this.actualizarTabla();
      }
    );

    this.productoService.get().subscribe(
      (productos) => {
        this.productos = productos;
      }
    )
  }

  actualizarTabla() {
    //no muestra los borrados con el filter, solo guardo los que tienen detaborrado en false
    this.dataSource.data = this.datosService.detalles.filter(borrado => borrado.detaBorrado==false);
  }

  agregar() {

    this.detaIdNew--;
    this.seleccionado = new PedidoDetalle();
    this.seleccionado.detaId = this.detaIdNew;

    this.form.setValue(this.seleccionado)
/*
    this.form.reset();
    this.seleccionado = new PedidoDetalle();
  */
    this.mostrarFormulario = true;
  }

  delete(fila: PedidoDetalle) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if(result){
        fila.detaBorrado = true;
        this.actualizarTabla();
      }
/*
      if (result) {
        this.pedidoDetalleService.delete(fila.detaId)
          .subscribe(() => {

            this.detalles = this.detalles.filter(x => x !== fila);

            this.actualizarTabla();
          });
      }*/
    });
  }

  edit(seleccionado: PedidoDetalle) {
    this.mostrarFormulario = true;
    this.seleccionado = seleccionado;
    
    this.form.setValue(seleccionado);
/*
    this.form.setValue({
      detaProdId: seleccionado.detaProdId,
      detaCantidad: seleccionado.detaCantidad,
      detaPrecio: seleccionado.detaPrecio
    });
*/
  }


  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.seleccionado, this.form.value);


    this.seleccionado.prodDescripcion = this.productos.find(producto => producto.prodId == this.seleccionado.detaProdId)!.prodDescripcion;

    if(this.seleccionado.detaId > 0){
      const elemento = this.detalles.find(detalle => detalle.detaId == this.seleccionado.detaId);
      this.detalles.splice(this.seleccionado.detaId, 1, elemento!);
    }else{
      this.datosService.detalles.push(this.seleccionado);
    }

    /*
      if (this.seleccionado.detaId) {
        this.pedidoDetalleService.put(this.seleccionado)
          .subscribe((pedidoDetalle) => {
            this.mostrarFormulario = false;
        });

      } else {
        this.seleccionado.detaPediId = this.pediId;
        this.pedidoDetalleService.post(this.seleccionado)
          .subscribe((pedidoDetalle: PedidoDetalle) => {
            pedidoDetalle.prodDescripcion = this.productos.find(producto => producto.prodId == pedidoDetalle.detaProdId)!.prodDescripcion;
            this.detalles.push(pedidoDetalle);
            this.mostrarFormulario = false;
            this.actualizarTabla();
        });
    }*/

    this.mostrarFormulario=false;
    this.actualizarTabla();

  }

  cancelar() {
    this.mostrarFormulario = false;
  }


}