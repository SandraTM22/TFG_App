<?php

namespace App\Service;

use App\Entity\Nota;
use App\Entity\User;


class NotaAssembler
{
    public function userToArray(?User $user): ?array
    {
        if (!$user) {
            return null;
        }

        return [
            'id' => $user->getId(),
            'name' => $user->getName()
        ];
    }

    public function notaToArray(Nota $nota): array
    {
        $usuario = $nota->getUsuario();
        $cliente = $nota->getCliente();
        $juzgado = $nota->getJuzgado();
        $expediente = $nota->getExpediente();
        $costa = $nota->getCosta();

        return [
            'id' => $nota->getId(),
            'contenido' => $nota->getContenido(),
            // Convierto la fecha (DateTimeInterface) a string:
            'fecha'     => $nota->getFecha() instanceof \DateTimeInterface
                ? $nota->getFecha()->format(\DateTime::ATOM)
                : null,
            'usuario'    => $usuario ? [
                'id'       => $usuario->getId(),
                'name' => $usuario->getName(),
            ] : null,

            // Si hay cliente asociado
            'cliente'    => $cliente ? [
                'id'        => $cliente->getId(),
                'nombre'    => $cliente->getNombre(),
                'apellido1' => $cliente->getApellido1(),
                'apellido2' => $cliente->getApellido2(),

            ] : null,

            // Si hay juzgado
            'juzgado'    => $juzgado ? [
                'id'   => $juzgado->getId(),
                'nombre' => $juzgado->getNombre()

            ] : null,

            // Para Expediente:
            'expediente' => $expediente ? [
                'id'       => $expediente->getId(),
                'autos'    => $expediente->getAutos(),
            ] : null,

            // Para Costa Asociada:
            'costa'      => $costa ? [
                'id'     => $costa->getId(),
                'estado' => is_object($costa->getEstado())
                    ? $costa->getEstado()->value
                    : $costa->getEstado(),
            ] : null,
        ];
    }
}
