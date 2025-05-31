<?php

namespace App\Controller;

use App\Entity\Documento;
use App\Form\DocumentoType;
use App\Repository\DocumentoRepository;
use App\Service\DocumentoAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/documento')]
final class DocumentoController extends AbstractController
{
    public function __construct(
        private readonly DocumentoRepository $repo,
        private readonly documentoAssembler $assembler,
    ) {}
    #[Route(name: 'documento_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $documentos = $this->repo->findAll();
        $data = array_map(
            fn($documento) => $this->assembler->documentoToArray($documento),
            $documentos
        );
        return $this->json($data);
    }

    #[Route('', name: 'documento_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Documento());
    }

    #[Route('/{id}', name: 'documento_show', methods: ['GET'])]
    public function show(Documento $documento): JsonResponse
    {
        $documentoFind = $this->assembler->documentoToArray($documento);
        return $this->json($documentoFind);
    }

    #[Route('/{id}', name: 'documento_edit', methods: ['PUT'])]
    public function edit(Request $request, Documento $documento,): JsonResponse
    {
        return $this->handleForm($request, $documento);
    }

    #[Route('/{id}', name: 'documento_delete', methods: ['DELETE'])]
    public function delete(Documento $documento): JsonResponse
    {
        $this->repo->delete($documento);
        return $this->json(['message' => 'Documento eliminado']);
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

    private function handleForm(Request $request, Documento $documento): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(DocumentoType::class, $documento);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($documento);
        return $this->json($this->assembler->documentoToArray($documento));
    }
}
