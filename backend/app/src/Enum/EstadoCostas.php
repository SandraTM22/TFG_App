<?php

namespace App\Enum;

enum EstadoCostas: string
{
    case SIN_TASAR           = 'sinTasar';
    case SOLICITADAS         = 'solicitadas';
    case NO_FIRMES           = 'noFirmes';
    case FIRMES              = 'firmes';
    case IMPUGNADAS          = 'impugnadas';
    case ALEGA_IMP           = 'AlegaImp';
    case PENDIENTE_INFORME   = 'pendienteInforme';
    case PENDIENTE_DECRETO   = 'pendienteDecreto';
    case RECURSO_REVISION    = 'recursoRevision';
    case EJECUCION           = 'ejecución';
}
