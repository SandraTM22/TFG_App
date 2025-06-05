import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Costa } from '../interfaces/costa';

@Injectable({ providedIn: 'root' })
export class ExportCostasService {
  constructor() {}

  /**
   * Genera y descarga un Excel con la lista de costas filtradas y ordenadas.
   */
  exportCostasToExcel(
    costas: Costa[],
    sortField: string,
    sortDir: 'asc' | 'desc'
  ) {
    // Clonar y ordenar
    let dataToExport = costas.slice();
    if (sortField) {
      dataToExport.sort((a, b) => {
        let valA: Date;
        let valB: Date;
        switch (sortField) {
          case 'fechaTC':
            valA = a.fechaTC ? new Date(a.fechaTC) : new Date(0);
            valB = b.fechaTC ? new Date(b.fechaTC) : new Date(0);
            break;
          case 'fecha15TC':
            valA = a.fecha15TC ? new Date(a.fecha15TC) : new Date(0);
            valB = b.fecha15TC ? new Date(b.fecha15TC) : new Date(0);
            break;
          case 'fechaDecreto':
            valA = a.fechaDecreto ? new Date(a.fechaDecreto) : new Date(0);
            valB = b.fechaDecreto ? new Date(b.fechaDecreto) : new Date(0);
            break;
          case 'fecha20Decreto':
            valA = a.fecha20Decreto ? new Date(a.fecha20Decreto) : new Date(0);
            valB = b.fecha20Decreto ? new Date(b.fecha20Decreto) : new Date(0);
            break;
          default:
            return 0;
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Transformar cada Costa en un objeto plano para Excel
    const exportData = dataToExport.map((c) => ({
      Estado: c.estado,
      'Estado Cobro': c.estadoCobro,
      Cliente: [
        c.expediente?.cliente?.nombre || '',
        c.expediente?.cliente?.apellido1 || '',
        c.expediente?.cliente?.apellido2 || '',
      ]
        .filter((x) => x)
        .join(' '),
      Autos: c.expediente?.autos || '',
      Juzgado: c.expediente?.juzgado || '',
      Procurador: c.expediente?.procurador
        ? `${c.expediente.procurador.nombre} ${c.expediente.procurador.apellido1}`
        : '',
      'Fecha Tasación': c.fechaTC
        ? new Date(c.fechaTC).toLocaleDateString('es-ES')
        : '',
      '+15 días': c.fecha15TC
        ? new Date(c.fecha15TC).toLocaleDateString('es-ES')
        : '',
      Decreto: c.fechaDecreto
        ? new Date(c.fechaDecreto).toLocaleDateString('es-ES')
        : '',
      '+20 días': c.fecha20Decreto
        ? new Date(c.fecha20Decreto).toLocaleDateString('es-ES')
        : '',
      Procedimiento: c.expediente?.tipoProcedimiento || '',
      Contrario: c.expediente?.contrario || '',
      Importe: c.importe != null ? c.importe : '',
    }));

    //Generar hoja de cálculo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Costas: worksheet },
      SheetNames: ['Costas'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Descargar
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `costas_filtradas_${new Date().getTime()}.xlsx`);
  }

  /**
   * Genera y descarga un PDF con la lista de costas filtradas y ordenadas.
   */
  exportCostasToPDF(
    costas: Costa[],
    sortField: string,
    sortDir: 'asc' | 'desc'
  ) {
    // 1) Clonar y ordenar si hace falta
    let dataToExport = costas.slice();
    if (sortField) {
      dataToExport.sort((a, b) => {
        let valA: Date;
        let valB: Date;
        switch (sortField) {
          case 'fechaTC':
            valA = a.fechaTC ? new Date(a.fechaTC) : new Date(0);
            valB = b.fechaTC ? new Date(b.fechaTC) : new Date(0);
            break;
          case 'fecha15TC':
            valA = a.fecha15TC ? new Date(a.fecha15TC) : new Date(0);
            valB = b.fecha15TC ? new Date(b.fecha15TC) : new Date(0);
            break;
          case 'fechaDecreto':
            valA = a.fechaDecreto ? new Date(a.fechaDecreto) : new Date(0);
            valB = b.fechaDecreto ? new Date(b.fechaDecreto) : new Date(0);
            break;
          case 'fecha20Decreto':
            valA = a.fecha20Decreto ? new Date(a.fecha20Decreto) : new Date(0);
            valB = b.fecha20Decreto ? new Date(b.fecha20Decreto) : new Date(0);
            break;
          default:
            return 0;
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 2) Construir cabeceras y filas, convirtiendo TODO a strings
    const headers = [
      'Estado',
      'Estado Cobro',
      'Cliente',
      'Autos',
      'Juzgado',
      'Procurador',
      'Fecha Tasación',
      '+15 días',
      'Decreto',
      '+20 días',
      'Procedimiento',
      'Contrario',
      'Importe',
    ];

    const rows = dataToExport.map((c) => {
      // Cliente como string
      const cliente = c.expediente?.cliente;
      const clienteStr = cliente
        ? [cliente.nombre, cliente.apellido1, cliente.apellido2]
            .filter((x) => !!x)
            .join(' ')
        : '';

      // Autos
      const autosStr = c.expediente?.autos || '';

      // Juzgado: si es string o un objeto que tiene "nombre"
      const juzgadoObj = c.expediente?.juzgado;
      const juzgadoStr =
        typeof juzgadoObj === 'string'
          ? juzgadoObj
          : (juzgadoObj as any)?.nombre || '';

      // Procurador: si es objeto con nombre y apellido1
      const procObj = c.expediente?.procurador;
      const procuradorStr = procObj
        ? [procObj.nombre, procObj.apellido1].filter((x) => !!x).join(' ')
        : '';

      // Fecha Tasación
      const fechaTCStr = c.fechaTC
        ? new Date(c.fechaTC).toLocaleDateString('es-ES')
        : '';

      // +15 días
      const fecha15Str = c.fecha15TC
        ? new Date(c.fecha15TC).toLocaleDateString('es-ES')
        : '';

      // Decreto
      const fechaDecStr = c.fechaDecreto
        ? new Date(c.fechaDecreto).toLocaleDateString('es-ES')
        : '';

      // +20 días
      const fecha20Str = c.fecha20Decreto
        ? new Date(c.fecha20Decreto).toLocaleDateString('es-ES')
        : '';

      // Procedimiento
      const procedimientoStr = c.expediente?.tipoProcedimiento || '';

      // Contrario: si es un objeto, convertir a string. Ejemplo:
      //    si Contrario tiene nombre y apellido, cámbialo por la propiedad correcta.
      //    Si Contrario ya es string, lo usamos directamente.
      const contrarioObj = c.expediente?.contrario;
      let contrarioStr = '';
      if (contrarioObj) {
        if (typeof contrarioObj === 'string') {
          contrarioStr = contrarioObj;
        } else {
          // Ajusta esto según tu interfaz Contrario. Por ejemplo:
          // contrarioObj.nombre, contrarioObj.apellido?
          contrarioStr = (contrarioObj as any)?.nombre || '';
        }
      }

      // Importe
      const importeStr =
        c.importe != null
          ? new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }).format(c.importe)
          : '';

      return [
        c.estado || '',
        c.estadoCobro || '',
        clienteStr,
        autosStr,
        juzgadoStr,
        procuradorStr,
        fechaTCStr,
        fecha15Str,
        fechaDecStr,
        fecha20Str,
        procedimientoStr,
        contrarioStr,
        importeStr,
      ];
    });

    // 3) Crear documento PDF
    const doc = new jsPDF('landscape', 'pt', 'a4');
    doc.setFontSize(14);
    doc.text('Listado de Costas Filtradas', 40, 40);

    // 4) Llamar a autoTable
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [5, 44, 19] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 40, right: 40, top: 40, bottom: 40 },
    });

    // 5) Descargar PDF
    doc.save(`costas_filtradas_${new Date().getTime()}.pdf`);
  }
}
