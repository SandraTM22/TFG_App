<?php

namespace App\Repository;

use App\Entity\Contrario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Contrario>
 */
class ContrarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Contrario::class);
    }
    public function save(Contrario $contrario): void
    {
        $em = $this->getEntityManager();
        $em->persist($contrario);
        $em->flush();       
    }

    public function delete(Contrario $contrario): void
    {
        $em = $this->getEntityManager();
        $em->remove($contrario);
        $em->flush(); 
    }

    public function findByNombre(string $term): array
    {
        return $this->createQueryBuilder('c')
            ->where('LOWER(c.nombre) LIKE :term')
            ->setParameter('term', '%' . strtolower($term) . '%')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }
}
