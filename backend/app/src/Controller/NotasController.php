<?php

namespace App\Controller;

use App\Entity\Nota;
use App\Form\NotasType;
use App\Repository\NotaRepository;
use App\Service\NotaAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/nota')]
final class NotasController extends AbstractController
{

    public function __construct(
        private readonly NotaRepository $repo,
        private readonly NotaAssembler $assembler,
    ) {}

    #[Route('', name: 'notas_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $notas = $this->repo->findAll();
        $data = array_map(
            fn($nota) => $this->assembler->notaToArray($nota),
            $notas
        );
        return $this->json($data);
    }

    #[Route('', name: 'notas_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
      // Crear la entidad y asignar usuario autenticado
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Usuario no autenticado'], 401);
        }

        $nota = new Nota();
        $nota->setUsuario($user);

        return $this->handleForm($request, $nota);
    }

    #[Route('/{id}', name: 'notas_show', methods: ['GET'])]
    public function show(Nota $nota): JsonResponse
    {
        $notasFind = $this->assembler->notaToArray($nota);
        return $this->json($notasFind);
    }

    #[Route('/{id}', name: 'notas_edit', methods: ['PUT'])]
    public function edit(Request $request, Nota $nota): JsonResponse
    {
        return $this->handleForm($request, $nota);
    }

    #[Route('/{id}', name: 'notas_delete', methods: ['DELETE'])]
    public function delete(Nota $nota): JsonResponse
    {
        $this->repo->delete($nota);
        return $this->json(['message' => 'Nota eliminada']);
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

    private function handleForm(Request $request, Nota $nota): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(NotasType::class, $nota);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($nota);
        return $this->json($this->assembler->notaToArray($nota));
    }
}
