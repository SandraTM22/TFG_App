<?php

namespace App\Service;

use App\Entity\Direccion;
use App\Entity\Juzgado;

class JuzgadoAssembler
{
    public function direccionToArray(?Direccion $direccion): ?array
    {
        if (!$direccion) {
            return null;
        }

        return [
            'id' => $direccion->getId(),
            'calle' => $direccion->getCalle(),
            'numero' => $direccion->getNumero(),
            'cp' => $direccion->getCp(),
            'localidad' => $direccion->getLocalidad(),
            'provincia' => $direccion->getProvincia(),
            'pais' => $direccion->getPais(),
        ];
    }

    public function juzgadoToArray(Juzgado $juzgado): array
    {
        return [
            'id' => $juzgado->getId(),
            'nombre' => $juzgado->getNombre(),
            'notas' => $juzgado->getNotas(),
            'direccion' => $this->direccionToArray($juzgado->getDireccion()),
        ];
    }
}
