import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Cliente} from '../shared/cliente';
import {ClienteService} from '../shared/cliente.service';
import { ConfirmarComponent } from '../confirmar/confirmar.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit, AfterViewInit {

  clientes : Cliente [] = [];
  clienteSelected = new Cliente();

  dataSource = new MatTableDataSource<Cliente>();

  mostrarForm = false;
  form = new FormGroup({});

  constructor(private cS : ClienteService, private formBuilder: FormBuilder, public dialog: MatDialog) { }
  
  @ViewChild(MatSort) sort!: MatSort;
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  columnas : string[] = ['clienId', 'clienNombre', 'clienDireccion', 'acciones'];

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      clienId: [''],
      clienNombre: ['', Validators.required],
      clienDireccion: ['', Validators.required],
      clienBorrado: [''],
      clienFechaAlta: ['']
    });

    this.cS.get().subscribe(
      (clientes) => {
        this.clientes = clientes;
        this.actualizarTabla();
      } 
    )

  }

  actualizarTabla() {
    this.dataSource.data = this.clientes;
    this.dataSource.sort = this.sort;
  }

  agregar() {
    this.form.reset();
    this.clienteSelected = new Cliente();
    this.mostrarForm= true;
  }

  delete(row: Cliente) {
    const dialogRef = this.dialog.open(ConfirmarComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);

      if (result) {
        this.cS.delete(row.clienId)
          .subscribe(() => {

            //this.items = this.items.filter( x => x !== row);

            this.clientes = this.clientes.filter((cliente) => {
              if (cliente.clienId != row.clienId) {
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

  edit(seleccionado: Cliente) {
    this.mostrarForm= true;
    this.clienteSelected = seleccionado;
    this.form.setValue(seleccionado);
  }

  guardar() {
    if (!this.form.valid) {
      return;
    }

    Object.assign(this.clienteSelected, this.form.value);


    if (this.clienteSelected.clienId) {
      this.cS.put(this.clienteSelected)
        .subscribe((cliente) => {
          this.mostrarForm = false;
        });

    } else {
      this.cS.post(this.clienteSelected)
        .subscribe((cliente) => {
          this.clientes.push(cliente);
          this.mostrarForm = false;
          this.actualizarTabla();
        });

    }

  }

  editar( row : Cliente){
    this.mostrarForm = true;
  }

  aceptar(){
    this.mostrarForm = false;
  }
  cancelar(){
    this.mostrarForm = false;
  }


}
