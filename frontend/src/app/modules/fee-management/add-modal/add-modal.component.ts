import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Costa } from '../../../shared/interfaces/costa';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { EstadoCostas } from '../../../shared/interfaces/enum/estado-costas.enum';
import { Cliente } from '../../../shared/interfaces/cliente';
import { ClienteService } from '../../../shared/services/cliente.service';
import { debounceTime, switchMap } from 'rxjs';

//Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormularioClienteComponent } from '../../../shared/components/modal-add-cliente/modal-add-cliente';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BtnComponent,
    MatAutocompleteModule,
    MatFormFieldModule,
    FormularioClienteComponent,
    MatInputModule,
  ],
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.css',
})
export class AddModalComponent implements OnInit {
  @Output() save = new EventEmitter<Costa>();
  costaForm: FormGroup;
  estadoCostas = EstadoCostas;
  estadosList = Object.entries(EstadoCostas).map(([key, value]) => ({
    key,
    value,
  }));

  /*******Cliente*****/
  clienteControl = new FormControl<Cliente | null>(null, Validators.required);
  filteredClientes: Cliente[] = [];
  mostrarFormularioNuevo = false;

  constructor(private fb: FormBuilder, private clienteService: ClienteService) {
    this.costaForm = this.fb.group({
      estado: [EstadoCostas.NO_FIRMES, Validators.required],
      cliente: ['', Validators.required],
      autos: ['', Validators.required],
      juzgado: ['', Validators.required],
      procurador: ['', Validators.required],
      importe: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.clienteControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((term) =>
          typeof term === 'string' ? this.clienteService.find(term) : []
        )
      )
      .subscribe((clientes) => {
        this.filteredClientes = clientes;
      });
  }

  onSubmit() {
    if (this.costaForm.valid) {
      this.save.emit(this.costaForm.value);
      this.costaForm.reset(); // limpiar tras guardar
    }
  }

  /**********************Cliente***************/
  displayFn(cliente: Cliente): string {
    return cliente
      ? `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`
      : '';
  }

  abrirFormularioCliente() {
    this.mostrarFormularioNuevo = true;
  }

  clienteCreado(cliente: Cliente) {
    this.clienteControl.setValue(cliente);
    this.mostrarFormularioNuevo = false;
  }
}
