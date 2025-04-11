<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


#[Route('/admin/users')]
final class UserController extends AbstractController
{
    //List all users
    #[Route('', name: 'list_user', methods: ['GET'])]
    public function list_user(EntityManagerInterface $em): JsonResponse {
        $users = $em->getRepository(User::class)->findAll();

        $data =  array_map(fn($user)=>[
            'id' => $user->getId(),
            'username' => $user->getName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'firstTime' => $user->getFirstTime(),
            'active' => $user->getActive()
        ],$users);  

        return $this->json($data);
    }

    //Create User
    #[Route('', name: 'create_user', methods: ['POST'])]
    public function create_user(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $params = json_decode($request->getContent(), true);
        $user = new User();
        $user->setName($params['username']);
        $user->setEmail($params['email']);
        $user->setPassword($params['password']);
        $user->setRoles($params['roles']);
        $user->setFirstTime(true);
        $user->setActive(false);

        $em->persist($user);
        $em->flush();
        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getName(),
            'email' => $user->getEmail(),
            'password' => $user->getPassword(),
            'roles' => $user->getRoles(),
            'firstTime' => $user->getFirstTime(),
            'active' => $user->getActive()
        ]);
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
        if (isset($params['username'])) {
            $user->setName($params['username']);
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
        if (isset($params['firstTime'])) {
            $user->setFirstTime($params['firstTime']);
        }
        if (isset($params['active'])) {
            $user->setActive($params['active']);
        }
        $em->flush();
        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getName(),
            'email' => $user->getEmail(),
            'password' => $user->getPassword(),
            'roles' => $user->getRoles(),
            'firstTime' => $user->getFirstTime(),
            'active' => $user->getActive()
        ]);
    }



}
