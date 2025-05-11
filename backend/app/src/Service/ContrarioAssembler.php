<?php

namespace App\Service;

use App\Entity\Direccion;
use App\Entity\Contrario;

class ContrarioAssembler
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

    public function contrarioToArray(Contrario $contrario): array
    {
        return [
            'id' => $contrario->getId(),
            'nombre' => $contrario->getNombre(),
            'nif' => $contrario->getNif(),
            'direccion' => $this->direccionToArray($contrario->getDireccion()),
        ];
    }
}
