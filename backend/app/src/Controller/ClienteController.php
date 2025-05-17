<?php

namespace App\Controller;

use App\Entity\Cliente;
use App\Form\ClienteType;
use App\Repository\ClienteRepository;
use App\Service\ClienteAssembler;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/cliente')]
final class ClienteController extends AbstractController
{
    public function __construct(
        private readonly ClienteRepository $repo,
        private readonly ClienteAssembler $assembler,
    ) {}

    #[Route(name: 'cliente_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $clientes = $this->repo->findAll();
        $data = array_map(
            fn($cliente) => $this->assembler->clienteToArray($cliente),
            $clientes
        );
        return $this->json($data);
    }

    #[Route('', name: 'cliente_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Cliente);
    }

    #[Route('/{id}', name: 'cliente_show', methods: ['GET'])]
    public function show(Cliente $cliente): JsonResponse
    {
        $clienteFind = $this->assembler->clienteToArray($cliente);
        return $this->json($clienteFind);
    }

    #[Route('/{id}', name: 'cliente_edit', methods: ['PUT'])]
    public function edit(Request $request, Cliente $cliente): JsonResponse
    {
        return $this->handleForm($request, $cliente);
    }

    #[Route('/{id}', name: 'cliente_delete', methods: ['DELETE'])]
    public function delete(Cliente $cliente): JsonResponse
    {
        $this->repo->delete($cliente);
        return $this->json(['message' => 'cliente eliminado']);
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

    private function handleForm(Request $request, Cliente $cliente): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(ClienteType::class, $cliente);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($cliente);
        return $this->json($this->assembler->clienteToArray($cliente));
    }
}
