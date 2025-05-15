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
        return [
            'id' => $nota->getId(),
            'contenido' => $nota->getContenido(),
            'fecha' => $nota->getFecha(),
            'usuario' => $this->userToArray($nota->getUsuario()),
        ];
    }
}
