<?php

namespace App\Service;

use App\Entity\Costas;

class CostasAssembler
{
    public function costasToArray(Costas $costas): array
    {
        return [
            'id' => $costas->getId(),
            'estado' => $costas->getEstado()->value,
            'fechaTC' => $costas->getFechaTC()?->format('d/m/Y'),
            'fecha15TC' => $costas->getFecha15TC()?->format('d/m/Y'),
            'fechaDecreto' => $costas->getFechaDecreto()?->format('d/m/Y'),
            'fecha20Decreto' => $costas->getFecha20Decreto()?->format('d/m/Y'),
            'importe' => $costas->getImporte(),
            'estadoCobro' => $costas->getEstadoCobro()->value,
        ];
    }
}
