<?php

namespace App\Service;

use App\Entity\Costas;

class CostasAssembler
{
    public function __construct(
        private NotaAssembler $notaAssembler
    ) {}

    public function costasToArray(Costas $costas): array
    {
        $exp = $costas->getExpediente();
        $cliente = $exp?->getCliente();
        $procurador = $exp?->getProcurador();

        // Mapear las notas de la costa
        $notasArray = [];
        foreach ($costas->getNotas() as $nota) {
            // Reutilizar NotaAssembler, pero pasándole 
            // un flag extra para que solo genere datos superficiales.
            $notasArray[] = [
                'id'        => $nota->getId(),
                'contenido' => $nota->getContenido(),
                'fecha'     => $nota->getFecha()->format(\DateTime::ATOM),
                // Usuario ligado a esta nota:
                'usuario'   => $nota->getUsuario() ? [
                    'id'       => $nota->getUsuario()->getId(),
                    'name' => $nota->getUsuario()->getName(),
                ] : null,
                
            ];
        }

        return [
            'id' => $costas->getId(),
            'estado' => $costas->getEstado()->value,
            'fechaTC' => $costas->getFechaTC()?->format(\DateTime::ATOM),
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
                'contrario'         => $exp->getContrario()?->getNombre(),
                'tipoProcedimiento' => $exp->getTipoProcedimiento(),
            ] : null,
            // Añadimos el array de notas
            'notas'         => $notasArray,
        ];
    }
}
