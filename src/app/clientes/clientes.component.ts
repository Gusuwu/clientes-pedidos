import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import {Cliente} from '../shared/cliente';
import {ClienteService} from '../shared/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes : Cliente [] = [];
  clienteSelected = new Cliente();

  mostrarForm = false;
  form = new FormGroup({});

  constructor(private cS : ClienteService, private formBuilder: FormBuilder) { }

  columnas : string[] = ['id', 'nombre', 'direccion', 'editar', 'borrar'];

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
        console.log(clientes);
      } 
    )

  }

  agregar() {
    this.form.reset();
    this.clienteSelected = new Cliente();
    this.mostrarForm= true;
  }

  delete(row: Cliente) {
    this.cS.delete(row.clienId)
      .subscribe(() => {
        this.clientes = this.clientes.filter((x) => {
          if (x.clienId != row.clienId) {
            return true
          } else {
            return false
          }
        });
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
