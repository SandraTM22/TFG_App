<?php

namespace App\Service;

use App\Entity\Cliente;
use App\Entity\Direccion;

class ClienteAssembler
{
    public function __construct(
        private readonly NotaAssembler $notaAssembler,
        private readonly ExpedienteAssembler $expedienteAssembler
    ) {}

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
        // Convertir la fecha de creación a string
        $fechaCreacion = $cliente->getFechaCreacion();
        $fechaCreacionStr = $fechaCreacion instanceof \DateTimeInterface
            ? $fechaCreacion->format(\DateTime::ATOM)
            : null;

        // Convertir cada Nota asociada a un array plano
        $notasArray = [];
        foreach ($cliente->getNotas() as $nota) {
            $notasArray[] = $this->notaAssembler->notaToArray($nota);
        }

        // Convertir cada Expediente asociado a un array plano
        $expedientesArray = [];
        foreach ($cliente->getExpedientes() as $expediente) {
            $expedientesArray[] = $this->expedienteAssembler->expedienteToArray($expediente);
        }

        return [
            'id' => $cliente->getId(),
            'nombre' => $cliente->getNombre(),
            'apellido1' => $cliente->getApellido1(),
            'apellido2' => $cliente->getApellido2(),
            'dni' => $cliente->getDni(),
            'direccion' => $this->direccionToArray($cliente->getDireccion()),
            'referencia' => $cliente->getReferencia(),
            'notas'         => $notasArray,      
            'expedientes'   => $expedientesArray,
            'fechaCreacion' => $cliente->getFechaCreacion(),       
        ];
    }
}
