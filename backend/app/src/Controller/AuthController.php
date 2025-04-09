<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;


#[Route('/api/Login')]
final class AuthController extends AbstractController
{
    #[Route('', name: 'api_login', methods:['POST'])]    
    public function login(Request $request, EntityManagerInterface $em, JWTTokenManagerInterface $JWTManager, UserPasswordHasherInterface $passwordHasher) : JsonResponse
    {
        $params = json_decode($request->getContent(), true);
        $email = $params['email'];
        $password = $params['password'];

        $user = $em->getRepository(User::class)->find($email);
        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return $this->json(['message' => 'Invalid credentials'], 401);
        }

        // Generar el JWT
        $token = $JWTManager->create($user);

        return $this->json(['token' => $token]);

    }
}
