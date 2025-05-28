<?php

namespace App\Service;

use App\Entity\Costas;

class CostasAssembler
{
    public function costasToArray(Costas $costas): array
    {
        $exp = $costas->getExpediente();
        $cliente = $exp?->getCliente();
        $procurador = $exp?->getProcurador();
        return [
            'id' => $costas->getId(),
            'estado' => $costas->getEstado()->value,
            'fechaTC' => $costas->getFechaTC()->format(\DateTime::ATOM),
            'fecha15TC' => $costas->getFecha15TC()?->format(\DateTime::ATOM),
            'fechaDecreto' => $costas->getFechaDecreto()?->format(\DateTime::ATOM),
            'fecha20Decreto' => $costas->getFecha20Decreto()?->format(\DateTime::ATOM),
            'importe' => $costas->getImporte(),
            'estadoCobro' => $costas->getEstadoCobro()->value,
            'expediente'    => $exp ? [
                'id'                => $exp->getId(),
                'autos'             => $exp->getAutos(),
                'cliente' => $cliente ? [
                    'id'       => $cliente->getId(),
                    'nombre'   => $cliente->getNombre(),
                    'apellido1' => $cliente->getApellido1(),
                    'apellido2' => $cliente->getApellido2(),
                ] : null,
                'procurador' => $procurador ? [
                    'id'       => $procurador->getId(),
                    'nombre'   => $procurador->getNombre(),
                    'apellido1' => $procurador->getApellido1(),
                    'apellido2' => $procurador->getApellido2(),
                ] : null,
                'juzgado'           => $exp->getJuzgado()?->getNombre(),
                /* 'procurador'        => $exp->getProcurador()?->getNombre(), */
                'contrario'         => $exp->getContrario()?->getNombre(),
                'tipoProcedimiento' => $exp->getTipoProcedimiento(),
            ] : null,
        ];
    }
}
