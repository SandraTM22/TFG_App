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
        // Mapear las notas del juzgado
        $notasArray = [];
        foreach ($juzgado->getNotas() as $nota) {
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
            'id' => $juzgado->getId(),
            'nombre' => $juzgado->getNombre(),
            // Añadimos el array de notas
            'notas'         => $notasArray,
            'direccion' => $this->direccionToArray($juzgado->getDireccion()),
        ];
    }
}
