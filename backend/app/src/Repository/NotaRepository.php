<?php

namespace App\Repository;

use App\Entity\Nota;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Nota>
 */
class NotaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Nota::class);
    }

    public function save(Nota $nota): void
    {
        $em = $this->getEntityManager();
        $em->persist($nota);
        $em->flush();       
    }

    public function delete(Nota $nota): void
    {
        $em = $this->getEntityManager();
        $em->remove($nota);
        $em->flush(); 
    }
}
