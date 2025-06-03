<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-default-users',
    description: 'Creates default admin, user and limited user accounts if they do not exist.',
)]
class CreateDefaultUsersCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private UserRepository $userRepository
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $usersToCreate = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'role' => 'ROLE_ADMIN',
                'password' => 'admin123',
            ],
            [
                'name' => 'Standard User',
                'email' => 'standard@example.com',
                'role' => 'ROLE_USER',
                'password' => 'userpass',
            ],
            [
                'name' => 'Limited User',
                'email' => 'limited@example.com',
                'role' => 'ROLE_USER_LIMITED',
                'password' => 'limitedpass',
            ],
        ];

        foreach ($usersToCreate as $userData) {
            $existing = $this->userRepository->findOneBy(['email' => $userData['email']]);

            if ($existing) {
                $io->warning("User with email {$userData['email']} already exists.");
                continue;
            }

            $user = new User();
            $user->setName($userData['name']);
            $user->setEmail($userData['email']);
            $user->setRoles([$userData['role']]);
            $user->setActive(true);

            $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);
            $user->setPassword($hashedPassword);

            $this->em->persist($user);
            $io->success("Created user: {$userData['email']} with role {$userData['role']}");
        }

        $this->em->flush();

        return Command::SUCCESS;
    }
}
