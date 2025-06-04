<?php

namespace App\Controller;

use App\Entity\Cliente;
use App\Entity\Contrario;
use App\Entity\Costas;
use App\Entity\Expediente;
use App\Entity\Juzgado;
use App\Entity\Procurador;
use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use App\Form\CostasType;
use App\Repository\CostasRepository;
use App\Repository\ExpedienteRepository;
use App\Service\CostasAssembler;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/costas')]
final class CostasController extends AbstractController
{
    public function __construct(
        public readonly CostasRepository $repo,
        public readonly CostasAssembler $assembler,
        private readonly ExpedienteRepository $expedienteRepository,
        private readonly EntityManagerInterface $entityManager

    ) {}

    #[Route('/custom', name: 'index_custom', methods: ['GET'])]
    public function indexCustome(): JsonResponse
    {

        $costas = $this->repo->findAllExpCli();
        $data = array_map(
            fn($costa) => $this->assembler->costasToArray($costa),
            $costas
        );
        return $this->json($data);
    }

    #[Route('', name: 'costas_index', methods: ['GET'])]
    public function index()
    {
        $costas = $this->repo->findAll();
    }

    #[Route('', name: 'costas_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Costas);
    }

    #[Route('/{id}', name: 'costas_show', methods: ['GET'])]
    public function show(Costas $costas): JsonResponse
    {
        $costasFind = $this->assembler->costasToArray($costas);
        return $this->json($costasFind);
    }

    #[Route('/{id}', name: 'costas_edit', methods: ['PUT'])]
    public function edit(Request $request, Costas $costas): JsonResponse
    {
        return $this->handleForm($request, $costas);
    }

    #[Route('/{id}', name: 'costas_delete', methods: ['DELETE'])]
    public function delete(Costas $costas): JsonResponse
    {
        $this->repo->delete($costas);
        return $this->json(['message' => 'Costas eliminadas']);
    }

    //recoger errores
    private function getFormErrors($form): array
    {
        $errors = [];

        foreach ($form->getErrors(true) as $error) {
            $field = $error->getOrigin()->getName();
            $errors[$field][] = $error->getMessage();
        }

        return $errors;
    }


    private function handleForm(Request $request, Costas $costas): JsonResponse
    {

        // decodificamos JSON
        $data = json_decode($request->getContent(), true);
        //mapeo manual de enums
        try {
            if (isset($data['estado'])) {
                $costas->setEstado(EstadoCostas::from($data['estado']));
            }
            if (isset($data['estadoCobro'])) {
                $costas->setEstadoCobro(EstadoCobro::from($data['estadoCobro']));
            }
        } catch (\ValueError $e) {
            return $this->json([
                'errors' => [
                    'estado' => ['Valor de enum inválido']
                ]
            ], 400);
        }

        //Validar que venga el bloque "expediente"
        if (!isset($data['expediente']) || !is_array($data['expediente'])) {
            return $this->json([
                'errors' => ['expediente' => ['Debe enviarse un objeto expediente válido.']]
            ], 400);
        }
        $expData = $data['expediente'];

        //Validar dentro de expediente:
        if (
            !isset($expData['autos']) ||
            !isset($expData['juzgado']) ||
            !isset($expData['cliente']['id'])
        ) {
            return $this->json([
                'errors' => [
                    'expediente' => ['Faltan autos, juzgado o id del cliente dentro de expediente.']
                ]
            ], 400);
        }

        $autos = $expData['autos'] ?? null;
        /* $juzgadoId = $expData['juzgado_id'] ?? null; */
        $juzgadoNombre = $expData['juzgado'];
        $clienteId    = $expData['cliente']['id'];
        $procuradorId = isset($expData['procurador']['id']) ? $expData['procurador']['id'] : null;
        /*  $contrarioId = $expData['contrario_id'] ?? null; */
        $contrarioNombre = $expData['contrario'] ?? null;
        $tipoProcedimiento = $expData['tipoProcedimiento'] ?? null;
        $fechaCreacionString = $expData['fechaCreacion'] ?? null;

        // Buscar las entidades de relación por sus IDs
        /*    $juzgado = $this->entityManager->getRepository(Juzgado::class)->find($expData['juzgado']['id']); */
        /* $contrario = $contrarioId ? $this->entityManager->getRepository(Contrario::class)->find($contrarioId) : null; */
        $cliente    = $this->entityManager->getRepository(Cliente::class)->find($clienteId);
        $juzgado    = $this->entityManager->getRepository(Juzgado::class)
            ->findOneBy(['nombre' => $juzgadoNombre]);
        $procurador = $procuradorId
            ? $this->entityManager->getRepository(Procurador::class)->find($procuradorId)
            : null;

        // Verificar que las entidades existan (especialmente cliente, juzgado)
        if (!$cliente) {
            return $this->json([
                'errors' => ['expediente' => ['Cliente con id ' . $clienteId . ' no existe.']]
            ], 400);
        }
        if (!$juzgado) {
            return $this->json([
                'errors' => ['expediente' => ['Juzgado "' . $juzgadoNombre . '" no existe.']]
            ], 400);
        }

        // Buscar o crear el Expediente
        $expediente = $this->expedienteRepository->findOneBy([
            'autos' => $autos,
            'juzgado' => $juzgado,
        ]);


        if (!$expediente) {
            $expediente = new Expediente();
            $expediente->setAutos($autos);
            $expediente->setJuzgado($juzgado);


            $expediente->setCliente($cliente); // <-- ¡Aquí se asigna el cliente!

            // Asigna las otras relaciones si existen y son válidas
            if ($procurador) {
                $expediente->setProcurador($procurador);
            }
            if ($contrarioNombre) {
                // Si Contrario también es una entidad, búscala primero:
                $contrarioEntity = $this->entityManager->getRepository(Contrario::class)
                    ->findOneBy(['nombre' => $contrarioNombre]);
                if ($contrarioEntity) {
                    $expediente->setContrario($contrarioEntity);
                }
            }

            // Asigna los otros campos del Expediente que vienen del frontend
            $expediente->setTipoProcedimiento($tipoProcedimiento);
            if ($fechaCreacionString) {
                try {
                    $expediente->setFechaCreacion(new DateTimeImmutable($fechaCreacionString));
                } catch (\Exception $e) {
                    return $this->json(['errors' => ['fechaCreacion' => 'Formato de fecha inválido para el Expediente.']], 400);
                }
            }


            $this->entityManager->persist($expediente);
            $this->entityManager->flush(); // ¡Importante para que el expediente tenga un ID si es nuevo!
        }

        // Asigna el expediente a la Costas
        $costas->setExpediente($expediente);


        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(CostasType::class, $costas);
        $form->submit($data, $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($costas);
        return $this->json($this->assembler->costasToArray($costas));
    }
}
