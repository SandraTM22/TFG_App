import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { ToastService } from '../../../shared/services/toast.service';
import { CostaPayload } from '../../../shared/interfaces/costaPayload';

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
  @Output() save = new EventEmitter<CostaPayload>();
  @Input() costaToEdit: Costa | null = null;
  @Output() cancel = new EventEmitter<void>();

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

  isJuzgadoLoaded = false;
  isProcuradorLoaded = false;
  isClienteLoaded = false;
  isContrarioLoaded = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private contrarioService: ContrarioService,
    private procuradorService: ProcuradorService,
    private juzgadoService: JuzgadoService,
    private costaService: CostaService,
    private toastService: ToastService
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
        this.isClienteLoaded = true;
      });

    // Búsqueda contrarios
    this.contrarioControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((term) =>
          typeof term === 'string' ? this.contrarioService.find(term) : []
        )
      )
      .subscribe((contrarios) => {
        this.filteredContrarios = contrarios;
        this.isContrarioLoaded = true;
      });

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
        this.isProcuradorLoaded = true;
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
        this.isJuzgadoLoaded = true;
      });

    //Si al inicializar ya hay una `costaToEdit`, rellenamos el formulario:
    if (this.costaToEdit) {
      this.fillFormWithCosta(this.costaToEdit);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Si el @Input() costaToEdit cambia (al pulsar "Editar" en el padre),
    //    parcheamos el form con los nuevos valores.
    if (changes['costaToEdit'] && !changes['costaToEdit'].firstChange) {
      if (this.costaToEdit) {
        this.fillFormWithCosta(this.costaToEdit);
      } else {
        this.resetForm();
      }
    }
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

    const fv = this.costaForm.value;

    // Construir el objeto Costa
    /*  const nuevaCosta: any = {
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
      () => {
        this.save.emit(); // Notifica al padre que la costa se ha guardado
        this.costaForm.reset(); // Limpia el formulario
        this.clienteControl.reset(); // Limpia los controles de autocompletado
        this.procuradorControl.reset();
        this.contrarioControl.reset();
        this.juzgadoControl.reset();
        this.toastService.showToast(
          'success',
          'Costa añadida correctamente',
          3000
        );
      },
      () => {
        this.toastService.showToast(
          'error',
          'Error al guardar la Costa en el backend',
          3000
        );
      }
    ); */

    const payload: CostaPayload = {
    // Si venimos en EDICIÓN, copiamos el id de la costa original
    id: this.costaToEdit?.id,

    estado: fv.estado,
    fechaTC: fv.fechaTC ? fv.fechaTC.toISOString().split('T')[0] : undefined,
    fecha15TC: fv.fecha15TC ? fv.fecha15TC.toISOString().split('T')[0] : undefined,
    fechaDecreto: fv.fechaDecreto ? fv.fechaDecreto.toISOString().split('T')[0] : undefined,
    fecha20Decreto: fv.fecha20Decreto ? fv.fecha20Decreto.toISOString().split('T')[0] : undefined,

    importe: fv.importe,
    estadoCobro: fv.estadoCobro,

    // Nodo expediente: solo los campos mínimos
    expediente: {
      // Si estamos editando un expediente existente, incluimos su id:
      id: this.costaToEdit?.expediente?.id,

      autos: fv.autos,
      cliente: fv.cliente ? { id: fv.cliente.id } : null,
      procurador: fv.procurador ? { id: fv.procurador.id } : null,
      juzgado: fv.juzgado ? fv.juzgado.nombre : null,
      contrario: fv.contrario ? fv.contrario.nombre : null,
      tipoProcedimiento: fv.tipoProcedimiento ?? null,
    },

    notas: this.costaToEdit?.notas ?? [],
  };

    this.save.emit(payload);
  }

  private fillFormWithCosta(c: Costa) {
    this.costaForm.patchValue({
      estado: c.estado,
      estadoCobro: c.estadoCobro,
      cliente: c.expediente?.cliente ? { ...c.expediente.cliente } : null,
      autos: c.expediente?.autos ?? '',
      juzgado: c.expediente?.juzgado
        ? { id: c.expediente.id, nombre: c.expediente.juzgado }
        : null,
      procurador: c.expediente?.procurador
        ? { ...c.expediente.procurador }
        : null,
      importe: c.importe,
      tipoProcedimiento: c.expediente?.tipoProcedimiento ?? '',
      contrario: c.expediente?.contrario
        ? { id: c.expediente.id, nombre: c.expediente.contrario }
        : null,
      fechaTC: c.fechaTC ? new Date(c.fechaTC) : null,
      fecha15TC: c.fecha15TC ? new Date(c.fecha15TC) : null,
      fechaDecreto: c.fechaDecreto ? new Date(c.fechaDecreto) : null,
      fecha20Decreto: c.fecha20Decreto ? new Date(c.fecha20Decreto) : null,
    });
  }

  /*** Resetear el form a valores por defecto (modo “Alta”) ***/
  public resetForm() {
    this.costaForm.reset({
      estado: EstadoCostas.NO_FIRMES,
      estadoCobro: EstadoCobro.NO_COBRADAS,
      cliente: null,
      autos: '',
      juzgado: null,
      procurador: null,
      importe: '',
      tipoProcedimiento: '',
      contrario: null,
      fechaTC: null,
      fecha15TC: null,
      fechaDecreto: null,
      fecha20Decreto: null,
    });
    this.clienteControl.reset();
    this.procuradorControl.reset();
    this.contrarioControl.reset();
    this.juzgadoControl.reset();
  }
}
