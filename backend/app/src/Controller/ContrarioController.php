<?php

namespace App\Controller;

use App\Entity\Contrario;
use App\Form\ContrarioType;
use App\Repository\ContrarioRepository;
use App\Service\ContrarioAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/contrario')]
final class ContrarioController extends AbstractController
{
    public function __construct(
        private readonly ContrarioRepository $repo,
        private readonly ContrarioAssembler $assembler,
    ) {}

    #[Route(name: 'contrario_index', methods: ['GET'])]
    public function index(): JsonResponse {
        $contrarios = $this->repo->findAll();
        $data = array_map(
            fn($contrario) => $this->assembler->contrarioToArray($contrario),
            $contrarios
        );
        return $this->json($data);
    }

    #[Route('', name: 'contrario_new', methods: ['POST'])]
    public function new(Request $request, ): JsonResponse {
        return $this->handleForm($request, new Contrario);
    }

    #[Route('/{id}', name: 'contrario_show', methods: ['GET'])]
    public function show(Contrario $contrario): JsonResponse {
        $contrarioFind = $this->assembler->contrarioToArray($contrario);
        return $this->json($contrarioFind);
    }

    #[Route('/{id}', name: 'contrario_edit', methods: ['PUT'])]
    public function edit(Request $request, Contrario $contrario, ): JsonResponse {
        return $this->handleForm($request, $contrario);
    }

    #[Route('/{id}', name: 'contrario_delete', methods: ['DELETE'])]
    public function delete(Request $request, Contrario $contrario, ): JsonResponse {
        $this->repo->delete($contrario);
        return $this->json(['message' => 'Contrario eliminado']);
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

    private function handleForm(Request $request, Contrario $contrario): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(ContrarioType::class, $contrario);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($contrario);
        return $this->json($this->assembler->contrarioToArray($contrario));
    }
}
