<?php

namespace App\Controller;

use App\Entity\Expediente;
use App\Form\ExpedienteType;
use App\Repository\ExpedienteRepository;
use App\Service\ExpedienteAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('api/expedientes')]
final class ExpedienteController extends AbstractController
{
    public function __construct(
        private readonly ExpedienteRepository $repo,
        private readonly ExpedienteAssembler $assembler,
    ) {}

    #[Route(name: 'expediente_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $expedientes = $this->repo->findAll();
        /* $data = array_map(
            fn($expediente) => $this->assembler->expedienteToArray($expediente),
            $expedientes
        );
        return $this->json($data); */

        return $this->json($expedientes,200,[],['groups'=> 'expediente:read']);
    }

    #[Route('', name: 'expediente_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Expediente);
    }

    #[Route('/{id}', name: 'expediente_show', methods: ['GET'])]
    public function show(Expediente $expediente): JsonResponse
    {
        $expedienteFind = $this->assembler->expedienteToArray($expediente);
        return $this->json($expedienteFind);
    }

    #[Route('/{id}', name: 'expediente_edit', methods: ['PUT'])]
    public function edit(Request $request, Expediente $expediente): JsonResponse
    {
        return $this->handleForm($request, $expediente);
    }

    #[Route('/{id}', name: 'expediente_delete', methods: ['DELETE'])]
    public function delete(Expediente $expediente): JsonResponse
    {
        $this->repo->delete($expediente);
        return $this->json(['message' => 'Expediente eliminado']);
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

    private function handleForm(Request $request, Expediente $expediente): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(ExpedienteType::class, $expediente);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($expediente);
        return $this->json($this->assembler->expedienteToArray($expediente));
    }
}
