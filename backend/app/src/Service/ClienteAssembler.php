<?php

namespace App\Service;

use App\Entity\Cliente;
use App\Entity\Direccion;

class ClienteAssembler
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

    public function clienteToArray(Cliente $cliente): array
    {
        return [
            'id' => $cliente->getId(),
            'nombre' => $cliente->getNombre(),
            'apellido1' => $cliente->getApellido1(),
            'apellido2' => $cliente->getApellido2(),
            'dni' => $cliente->getDni(),
            'direccion' => $this->direccionToArray($cliente->getDireccion()),
            'referencia' => $cliente->getReferencia(),
            'notas' => $cliente->getNotas(),
            'fechaCreacion' => $cliente->getFechaCreacion(),
            'expedientes' => $cliente->getExpedientes(),            
        ];
    }
}
