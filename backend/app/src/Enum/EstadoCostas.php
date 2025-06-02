<?php

namespace App\Enum;

enum EstadoCostas: string
{
    case SIN_TASAR           = 'Sin tasar';
    case SOLICITADAS         = 'Solicitadas';
    case NO_FIRMES           = 'No firmes';
    case FIRMES              = 'Firmes';
    case IMPUGNADAS          = 'Impugnadas';
    case ALEGA_IMP           = 'Alega impugnación';
    case PENDIENTE_INFORME   = 'Pendiente informe';
    case PENDIENTE_DECRETO   = 'Pendiente decreto';
    case RECURSO_REVISION    = 'Recurso revisión';
    case EJECUCION           = 'Ejecución';
}
