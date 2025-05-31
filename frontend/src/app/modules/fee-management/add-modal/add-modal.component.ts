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
import { Contrario } from '../../../shared/interfaces/contrario';
import { ContrarioService } from '../../../shared/services/contrario.service';
import { FormularioClienteComponent } from '../../../shared/components/modal-add-cliente/modal-add-cliente';

//Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormularioContrarioComponent } from '../../../shared/components/modal-add-contrario/modal-add-contrario';

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
    MatSelectModule,
    MatIconModule,
    FormularioContrarioComponent,
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
  mostrarFormularioNuevoCliente = false;

  /*******Contrario*****/
  contrarioControl = new FormControl<Contrario | null>(
    null,
    Validators.required
  );
  filteredContrarios: Contrario[] = [];
  mostrarFormularioNuevoContrario = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private contrarioService: ContrarioService
  ) {
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
    // Búsqueda clientes
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

    // Búsqueda contrarios
    this.contrarioControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((term) =>
          typeof term === 'string' ? this.contrarioService.find(term) : []
        )
      )
      .subscribe((contrarios) => (this.filteredContrarios = contrarios));
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
    this.mostrarFormularioNuevoCliente = true;
  }

  clienteCreado(cliente: Cliente) {
    this.clienteControl.setValue(cliente);
    this.mostrarFormularioNuevoCliente = false;
  }

  /**********************Contrario***************/
  displayFnContrario(contrario: Contrario): string {
    return contrario ? `${contrario.nombre}` : '';
  }

  abrirFormularioContrario() {
    this.mostrarFormularioNuevoContrario = true;
  }

  contrarioCreado(contrario: Contrario) {
    this.contrarioControl.setValue(contrario);
    this.mostrarFormularioNuevoContrario = false;
  }
}
