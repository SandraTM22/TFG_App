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
import { FormularioContrarioComponent } from '../../../shared/components/modal-add-contrario/modal-add-contrario';
import { Procurador } from '../../../shared/interfaces/procurador';
import { ProcuradorService } from '../../../shared/services/procurador.service';
import { FormularioProcuradorComponent } from '../../../shared/components/modal-add-procurador/modal-add-procurador';
import { Juzgado } from '../../../shared/interfaces/juzgado';
import { JuzgadoService } from '../../../shared/services/juzgado.service';
import { FormularioJuzgadoComponent } from '../../../shared/components/modal-add-juzgado/modal-add-juzgado';
import { EstadoCobro } from '../../../shared/interfaces/enum/estado-cobro.enum';
import { CostaService } from '../../../shared/services/costa.service';

//Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    FormularioProcuradorComponent,
    FormularioJuzgadoComponent,
    MatDatepickerModule,
    MatNativeDateModule,
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
  estadosCobroList = Object.entries(EstadoCobro).map(([key, value]) => ({
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

  /*******Procurador*****/
  procuradorControl = new FormControl<Procurador | null>(
    null,
    Validators.required
  );
  filteredProcuradores: Procurador[] = [];
  mostrarFormularioNuevoProcurador = false;

  /*******Juzgado*****/
  juzgadoControl = new FormControl<Juzgado | null>(null, Validators.required);
  filteredJuzgados: Juzgado[] = [];
  mostrarFormularioNuevoJuzgado = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private contrarioService: ContrarioService,
    private procuradorService: ProcuradorService,
    private juzgadoService: JuzgadoService,
    private costaService: CostaService
  ) {
    this.costaForm = this.fb.group({
      estado: [EstadoCostas.NO_FIRMES, Validators.required],
      estadoCobro: [EstadoCobro.NO_COBRADAS, Validators.required],
      cliente: this.clienteControl,
      autos: ['', [Validators.required, Validators.pattern(/^\d+\/\d{4}$/)]],
      juzgado: this.juzgadoControl,
      procurador: this.procuradorControl,
      importe: ['', Validators.required],
      tipoProcedimiento: [''],
      contrario: this.contrarioControl,
      fechaTC: [null],
      fecha15TC: [null],
      fechaDecreto: [null],
      fecha20Decreto: [null],
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

    //Búsqueda procuradores
    this.procuradorControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((term) =>
          typeof term === 'string' ? this.procuradorService.find(term) : []
        )
      )
      .subscribe((procuradores) => {
        this.filteredProcuradores = procuradores;
      });

    //Búsqueda juzgados
    this.juzgadoControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((term) =>
          typeof term === 'string' ? this.juzgadoService.find(term) : []
        )
      )
      .subscribe((juzgs) => {
        this.filteredJuzgados = juzgs;
      });
  }

  /********** Métodos displayForAutocomplete **********/
  displayFn(cliente: Cliente): string {
    return cliente
      ? `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`
      : '';
  }

  displayFnContrario(contrario: Contrario): string {
    return contrario ? `${contrario.nombre}` : '';
  }

  displayFnProcurador(procurador: Procurador): string {
    return procurador
      ? `${procurador.nombre} ${procurador.apellido1} ${procurador.apellido2}`
      : '';
  }

  displayFnJuzgado(juzgado: Juzgado): string {
    return juzgado ? `${juzgado.nombre}` : '';
  }

  /********** Cuando el usuario hace “blur” sin seleccionar nada, borramos sugerencias para que no queden solapadas con el “Crear nuevo” **********/

  onClienteBlur() {
    setTimeout(() => {
      this.filteredClientes = [];
    }, 200);
  }
  onProcuradorBlur() {
    setTimeout(() => {
      this.filteredProcuradores = [];
    }, 200);
  }
  onContrarioBlur() {
    setTimeout(() => {
      this.filteredContrarios = [];
    }, 200);
  }
  onJuzgadoBlur() {
    setTimeout(() => {
      this.filteredJuzgados = [];
    }, 200);
  }

  /********** Cuando el usuario selecciona una opción **********/

  onClienteSelected(cliente: Cliente) {
    this.clienteControl.setValue(cliente);
    this.mostrarFormularioNuevoCliente = false;
  }
  onProcuradorSelected(p: Procurador) {
    this.procuradorControl.setValue(p);
    this.mostrarFormularioNuevoProcurador = false;
  }
  onContrarioSelected(c: Contrario) {
    this.contrarioControl.setValue(c);
    this.mostrarFormularioNuevoContrario = false;
  }
  onJuzgadoSelected(j: Juzgado) {
    this.juzgadoControl.setValue(j);
    this.mostrarFormularioNuevoJuzgado = false;
  }

  /********** Abrir formularios nuevos **********/
  abrirFormularioCliente() {
    this.mostrarFormularioNuevoCliente = true;
    this.filteredClientes = [];
  }
  abrirFormularioProcurador() {
    this.mostrarFormularioNuevoProcurador = true;
    this.filteredProcuradores = [];
  }
  abrirFormularioContrario() {
    this.mostrarFormularioNuevoContrario = true;
    this.filteredContrarios = [];
  }
  abrirFormularioJuzgado() {
    this.mostrarFormularioNuevoJuzgado = true;
    this.filteredJuzgados = [];
  }

  /********** Callbacks desde los modales hijos **********/
  clienteCreado(cliente: Cliente) {
    this.clienteControl.setValue(cliente);
    this.mostrarFormularioNuevoCliente = false;
  }
  procuradorCreado(p: Procurador) {
    this.procuradorControl.setValue(p);
    this.mostrarFormularioNuevoProcurador = false;
  }
  contrarioCreado(c: Contrario) {
    this.contrarioControl.setValue(c);
    this.mostrarFormularioNuevoContrario = false;
  }
  juzgadoCreado(j: Juzgado) {
    this.juzgadoControl.setValue(j);
    this.mostrarFormularioNuevoJuzgado = false;
  }

  onSubmit() {
    if (this.costaForm.invalid) {
      this.costaForm.markAllAsTouched();
      return;
    }

    const formValues = this.costaForm.value;

    // Construir el objeto Costa
    const nuevaCosta: any = {
      estado: formValues.estado,
      estadoCobro: formValues.estadoCobro,
      importe: formValues.importe,
      notas: [],
      fechaTC: formValues.fechaTC || undefined,
      fecha15TC: formValues.fecha15TC || undefined,
      fechaDecreto: formValues.fechaDecreto || undefined,
      fecha20Decreto: formValues.fecha20Decreto || undefined,

      autos: formValues.autos,
      tipoProcedimiento: formValues.tipoProcedimiento || null,
      fechaCreacion: new Date(),
      // Pasar solo el ID de las relaciones,
      cliente_id: formValues.cliente ? formValues.cliente.id : null,
      juzgado_id: formValues.juzgado ? formValues.juzgado.id : null,
      procurador_id: formValues.procurador ? formValues.procurador.id : null,
      contrario_id: formValues.contrario ? formValues.contrario.id : null,
    };

    this.costaService.add(nuevaCosta).subscribe(
      (response) => {
        this.save.emit(); // Notifica al padre que la costa se ha guardado
        this.costaForm.reset(); // Limpia el formulario
        this.clienteControl.reset(); // Limpia los controles de autocompletado
        this.procuradorControl.reset();
        this.contrarioControl.reset();
        this.juzgadoControl.reset();
      },
      (error) => {
        console.error('Error al guardar la Costa en el backend:', error);
      }
    );
  }
}
