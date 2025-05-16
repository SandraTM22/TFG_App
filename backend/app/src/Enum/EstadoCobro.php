<?php

namespace App\Enum;

enum EstadoCobro: string
{
    case NO_COBRADAS           = 'No cobradas';
    case CONSIGNADAS           = 'Consignadas';
    case CLIENTE               = 'Cliente';
    case PENDIENTE_TRANS       = 'Pendiente transferencia';
    case cobradas              = 'Cobradas';
    
}
