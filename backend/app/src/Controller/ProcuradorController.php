<?php

namespace App\Controller;

use App\Entity\Procurador;
use App\Form\ProcuradorType;
use App\Repository\ProcuradorRepository;
use App\Service\ProcuradorAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/procurador')]
final class ProcuradorController extends AbstractController
{
    public function __construct(
        private readonly ProcuradorRepository $repo,
        private readonly ProcuradorAssembler $assembler,

    ) {}

    #[Route(name: 'procurador_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $procuradores = $this->repo->findAll();
        $data = array_map(
            fn($procurador) => $this->assembler->procuradorToArray($procurador),
            $procuradores
        );
        return $this->json($data);
    }

    #[Route('', name: 'procurador_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Procurador);
    }

    #[Route('/{id}', name: 'procurador_show', methods: ['GET'])]
    public function show(Procurador $procurador): JsonResponse
    {
        $procuradorFind = $this->assembler->procuradorToArray($procurador);
        return $this->json($procuradorFind);
    }

    #[Route('/{id}', name: 'procurador_edit', methods: ['PUT'])]
    public function edit(Request $request, Procurador $procurador): JsonResponse
    {
        return $this->handleForm($request, $procurador);
    }

    #[Route('/{id}', name: 'procurador_delete', methods: ['DELETE'])]
    public function delete(Request $request, Procurador $procurador): JsonResponse
    {
        $this->repo->delete($procurador);
        return $this->json(['message' => 'Procurador eliminado']);
    }

    //recoger errores
    private function getFormErrors($form): array
    {
        $errors = [];
        // Itera sobre todos los errores del formulario
        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = [];
                foreach ($child->getErrors(true) as $error) {
                    $errors[$child->getName()][] = $error->getMessage();
                }
            }
        }
        return $errors;
    }

    private function handleForm(Request $request, Procurador $procurador): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(ProcuradorType::class, $procurador);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($procurador);
        return $this->json($this->assembler->procuradorToArray($procurador));
    }
}
