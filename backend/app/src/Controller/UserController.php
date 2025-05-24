<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use App\Form\UserType;

#[Route('/admin/users')]
final class UserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $repo,
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {}

   
    #[Route('', name: 'list_user', methods: ['GET'])]
    public function list_user(EntityManagerInterface $em): JsonResponse
    {           
        
        $users = $em->getRepository(User::class)->findBy([], ['id' => 'ASC']);
        $data =  array_map(fn($user) => [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'active' => $user->getactive()
        ], $users);

        return $this->json($data);
    }

    //Create User
    #[Route('', name: 'create_user', methods: ['POST'])]
    public function create_user(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        return $this->handleForm($request, new User());
        
    }

    //Delete user
    #[Route('/{id}', name: 'delete_user', methods: ['DELETE'])]
    public function delete_user($id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $em->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }
        $em->remove($user);
        $em->flush();
        return $this->json(['message' => 'User deleted']);
    }

    //Update user
    #[Route('/{id}', name: 'update_user', methods: ['PUT'])]
    public function update_user($id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $em->getRepository(User::class)->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $params = json_decode($request->getContent(), true);
        if (isset($params['name'])) {
            $user->setName($params['name']);
        }
        if (isset($params['email'])) {
            $user->setEmail($params['email']);
        }
        if (isset($params['password'])) {
            $user->setPassword($params['password']);
        }
        if (isset($params['roles'])) {
            $user->setRoles($params['roles']);
        }
        if (isset($params['active'])) {
            $user->setActive($params['active']);
        }

        $em->flush();
        return $this->json([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'password' => $user->getPassword(),
            'roles' => $user->getRoles(),
            'active' => $user->getActive()
        ]);
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

    private function handleForm(Request $request, User $user): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        $inputMissing = $request->isMethod('POST');
        // POST, inputMissing = true (el Form lo detecta como faltante y salta la validación )
        // inputMissing = false (solo modifica lo enviado)

        $form = $this->createForm(UserType::class, $user);
        $form->submit(json_decode($request->getContent(), true), $inputMissing);

        if (!$form->isValid()) {
            return $this->json(['errors' => $this->getFormErrors($form)], 400);
        }

        // hash password if new or changed
        if (isset($data['password'])) {
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );
        }

        $this->repo->save($user);
        // response data
        $data = [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'active' => $user->getActive(),
        ];

        return $this->json($data);
    }
}
