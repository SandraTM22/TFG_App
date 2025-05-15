<?php

namespace App\Service;

use App\Entity\Documento;

class DocumentoAssembler
{
    public function documentoToArray(Documento $documento): array
    {
        return [
            'id' => $documento->getId(),
            'nombre' => $documento->getNombre(),
            'tipo' => $documento->getTipo(),
            'ruta' => $documento->getRuta(),
            'fechaSubida' => $documento->getFechaSubida(),
        ];
    }
}
