<?php

namespace App\Service;

use App\Entity\Expediente;
use App\Entity\Contrario;
use App\Entity\Juzgado;
use App\Entity\Procurador;

class ExpedienteAssembler
{
    public function contrarioToArray(?Contrario $contrario): ?array
    {
        if (!$contrario) {
            return null;
        }

        return [
            'id' => $contrario->getId(),
            'nombre' => $contrario->getNombre()
        ];
    }

    public function juzgadoToArray(?Juzgado $juzgado): ?array
    {
        if (!$juzgado) {
            return null;
        }

        return [
            'id' => $juzgado->getId(),
            'nombre' => $juzgado->getNombre()
        ];
    }

    public function procuradorToArray(?Procurador $procurador): ?array
    {
        if (!$procurador) {
            return null;
        }

        return [
            'id' => $procurador->getId(),
            'nombre' => $procurador->getNombre(),
        ];
    }

    public function expedienteToArray(Expediente $expediente): array
    {
        return [
            'id' => $expediente->getId(),
            'descripcion' =>$expediente->getDescripcion(),
            'contrario' => $this->contrarioToArray($expediente->getContrario()),
            'juzgado' => $this->juzgadoToArray($expediente->getJuzgado()),
            'procurador' => $this->procuradorToArray($expediente->getProcurador()),
            'autos' => $expediente->getAutos(),
            'estado' => $expediente->getEstado(),
            'tipo_procedimiento' => $expediente->getTipoProcedimiento(),
            'restitucion_economica' => $expediente->getRestitucionEconomica(),
            'fecha_creacion' => $expediente->getFechaCreacion()->format('Y-m-d H:i:s'),
        ];
    }
}
