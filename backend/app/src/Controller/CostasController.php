<?php

namespace App\Controller;

use App\Entity\Costas;
use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use App\Form\CostasType;
use App\Repository\CostasRepository;
use App\Repository\ExpedienteRepository;
use App\Service\CostasAssembler;
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

        // Lógica para buscar o crear el Expediente
        if (!isset($data['autos']) || !isset($data['juzgado_id'])) {
            return $this->json([
                'errors' => ['autos/juzgado_id' => ['Faltan autos o id del juzgado']]
            ], 400);
        }

        $autos = $data['autos'];
        $juzgado = $this->entityManager->getRepository(\App\Entity\Juzgado::class)->find($data['juzgado_id']);

        if (!$juzgado) {
            return $this->json([
                'errors' => ['juzgado_id' => ['Juzgado no encontrado']]
            ], 400);
        }

        $expediente = $this->expedienteRepository->findOneBy([
            'autos' => $autos,
            'juzgado' => $juzgado,
        ]);

        if (!$expediente) {
            $expediente = new \App\Entity\Expediente();
            $expediente->setAutos($autos);
            $expediente->setJuzgado($juzgado);
            $this->entityManager->persist($expediente);
        }

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
