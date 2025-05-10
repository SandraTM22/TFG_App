<?php

namespace App\Service;

use App\Entity\Direccion;
use App\Entity\Procurador;

class ProcuradorAssembler
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

    public function procuradorToArray(Procurador $procurador): array
    {
        return [
            'id' => $procurador->getId(),
            'nombre' => $procurador->getNombre(),
            'apellido1' => $procurador->getApellido1(),
            'apellido2' => $procurador->getApellido2(),
            'colegio' => $procurador->getColegio(),
            'numeroColegiado' => $procurador->getNumeroColegiado(),
            'direccion' => $this->direccionToArray($procurador->getDireccion()),
        ];
    }
}
