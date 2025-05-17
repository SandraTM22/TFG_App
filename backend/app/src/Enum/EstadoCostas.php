<?php

namespace App\Enum;

enum EstadoCostas: string
{
    case SIN_TASAR           = 'Sin Tasar';
    case SOLICITADAS         = 'solicitadas';
    case NO_FIRMES           = 'No Firmes';
    case FIRMES              = 'Firmes';
    case IMPUGNADAS          = 'Impugnadas';
    case ALEGA_IMP           = 'Alega Impugnacion';
    case PENDIENTE_INFORME   = 'Pendiente Informe';
    case PENDIENTE_DECRETO   = 'Pendiente Decreto';
    case RECURSO_REVISION    = 'Recurso Revision';
    case EJECUCION           = 'Ejecución';
}
