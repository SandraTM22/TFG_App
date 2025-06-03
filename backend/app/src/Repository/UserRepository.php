<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findByRoleUser(): ?User
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT * FROM "user" WHERE roles::text LIKE :role LIMIT 1';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('role', '%ROLE_USER%');
        $result = $stmt->executeQuery()->fetchAssociative();

        if (!$result) {
            return null;
        }

        return $this->find($result['id']);
    }
      public function findByRoleLimited(): ?User
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT * FROM "user" WHERE roles::text LIKE :role LIMIT 1';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('role', '%ROLE_USER_LIMITED%');
        $result = $stmt->executeQuery()->fetchAssociative();

        if (!$result) {
            return null;
        }

        return $this->find($result['id']);
    }
      public function findByRoleAdmin(): ?User
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = 'SELECT * FROM "user" WHERE roles::text LIKE :role LIMIT 1';
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('role', '%ROLE_ADMIN%');
        $result = $stmt->executeQuery()->fetchAssociative();

        if (!$result) {
            return null;
        }

        return $this->find($result['id']);
    }


    public function save(User $user): void
    {
        $em = $this->getEntityManager();
        $em->persist($user);
        $em->flush();
    }

    public function delete(User $user): void
    {
        $em = $this->getEntityManager();
        $em->remove($user);
        $em->flush();
    }
}
