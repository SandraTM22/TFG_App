<?php

namespace App\Controller;

use App\Entity\Juzgado;
use App\Form\JuzgadoType;
use App\Repository\JuzgadoRepository;
use App\Service\JuzgadoAssembler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/juzgado')]
final class JuzgadoController extends AbstractController
{

    public function __construct(
        private readonly JuzgadoRepository $repo,
        private readonly JuzgadoAssembler $assembler,
    ) {}

    #[Route('', name: 'juzgado_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $juzgados = $this->repo->findAll();
        $data = array_map(
            fn($juzgado) => $this->assembler->juzgadoToArray($juzgado),
            $juzgados
        );
        return $this->json($data);
    }

    #[Route('', name: 'juzgado_new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        return $this->handleForm($request, new Juzgado());
    }

    #[Route('/{id}', name: 'juzgado_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Juzgado $juzgado): JsonResponse
    {
        $juzgadoFind = $this->assembler->juzgadoToArray($juzgado);
        return $this->json($juzgadoFind);
    }

    #[Route('/{id}', name: 'juzgado_edit', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Juzgado $juzgado): JsonResponse
    {
        return $this->handleForm($request, $juzgado);
    }

    #[Route('/{id}', name: 'juzgado_delete', methods: ['DELETE'], requirements: ['id' => '\d+'])]
    public function delete(Juzgado $juzgado): JsonResponse
    {
        $this->repo->delete($juzgado);
        return $this->json(['message' => 'Juzgado eliminado']);
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

    private function handleForm(Request $request, Juzgado $juzgado): JsonResponse
    {

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(JuzgadoType::class, $juzgado);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        $this->repo->save($juzgado);
        return $this->json($this->assembler->juzgadoToArray($juzgado));       
        /* $data =  [
            'id' => $juzgado->getId(),
            'nombre' => $juzgado->getNombre(),
            'direccion' => $juzgado->getDireccion(),
            'notas' => $juzgado->getNotas()
        ];

        return $this->json($data); */
    }

    #[Route('/find', name: 'buscar_juzgado', methods: ['GET'])]
    public function buscarJuzgado(Request $request): JsonResponse
    {
        $search = $request->query->get('search', '');
        $juzgados = $this->repo->findByNombre($search);
         $data = array_map(
        fn($juzgado) => $this->assembler->juzgadoToArray($juzgado),
        $juzgados
    );

        return $this->json($data, 200, []);
    }
}
