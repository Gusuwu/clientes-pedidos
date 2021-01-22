import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmarComponent } from '../confirmar/confirmar.component';
import { Cliente } from '../shared/cliente';
import { ClienteService } from '../shared/cliente.service';
import { Pedido } from '../shared/pedido';
import { PedidoService } from '../shared/pedido.service';



@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit, AfterViewInit {

  pedidos: Pedido[] = [];
  pedidoSelected = new Pedido();

  columnas: string[] = ['pediId', 'pediFecha', 'clienNombre', 'acciones'];
  dataSource = new MatTableDataSource<Pedido>();


  form = new FormGroup({});
  mostrarFormulario = false;

  clientes: Cliente[] = [];

  minDate: Date = new Date();

  constructor(private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      pediId: [''],
      pediFecha: ['', Validators.required],
      pediClienId: ['', Validators.required],
      pediFechaAlta: [''],
      pediBorrado: [''],
      clienNombre:['']
    });

    this.pedidoService.get().subscribe(
      (pedidos) => {
        this.pedidos = pedidos;
        this.actualizarTabla();
      }
    );

    this.clienteService.get().subscribe(
      (clientes)=>{
        this.clientes = clientes;
      }
    )
  }

  mostrar = false;
  mostrarDetalle():Boolean{
    if(this.pedidoSelected.pediId){
      return this.mostrar = true;
    }else{
      return this.mostrar = false;
    }
  }

  actualizarTabla() {
    this.dataSource.data = this.pedidos;
    this.dataSource.sort = this.sort;
  }

  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregar() {
    this.form.reset();
    this.pedidoSelected = new Pedido();
    this.mostrarFormulario = true;
  }

  delete(row: Pedido) {

    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.pedidoService.delete(row.pediId)
          .subscribe(() => {

            this.pedidos = this.pedidos.filter( x => x !== row);

            this.actualizarTabla();
          });
      }
    });
  }

  edit(seleccionado: Pedido) {
    this.mostrarFormulario = true;
    this.pedidoSelected = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.pedidoSelected, this.form.value);

    // si el formulario es diferente asignar uno por uno...
    //this.seleccionado.prodDescripcion = this.form.value.prodDescripcion;
    //this.seleccionado.prodPrecio = this.form.value.prodPrecio;


    if (this.pedidoSelected.pediId) {
      this.pedidoService.put(this.pedidoSelected)
        .subscribe((pedido) => {
          this.mostrarFormulario = false;
        });

    } else {
      this.pedidoService.post(this.pedidoSelected)
        .subscribe((pedido: Pedido) => {
          pedido.clienNombre = this.clientes.find(c => c.clienId == pedido.pediClienId)!.clienNombre;
          this.pedidos.push(pedido);
          this.mostrarFormulario = false;
          this.actualizarTabla();
        });

    }

  }
  cancelar() {
    this.mostrarFormulario = false;
  }


}
