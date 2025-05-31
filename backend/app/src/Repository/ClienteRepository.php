<?php

namespace App\Repository;

use App\Entity\Cliente;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Cliente>
 */
class ClienteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cliente::class);
    }

    public function save(Cliente $cliente): void
    {
        $em = $this->getEntityManager();
        $em->persist($cliente);
        $em->flush();
    }

    public function delete(Cliente $cliente): void
    {
        $em = $this->getEntityManager();
        $em->remove($cliente);
        $em->flush();
    }

    public function findByNombreOrDni(string $term): array
    {
        return $this->createQueryBuilder('c')
            ->where('LOWER(c.nombre) LIKE :term OR LOWER(c.apellido1) LIKE :term OR LOWER(c.apellido2) LIKE :term OR c.dni LIKE :term')
            ->setParameter('term', '%' . strtolower($term) . '%')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }
}
