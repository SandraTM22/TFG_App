<?php

namespace App\Repository;

use App\Entity\Juzgado;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Juzgado>
 */
class JuzgadoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Juzgado::class);
    }

     public function save(Juzgado $juzgado): void
    {
        $em = $this->getEntityManager();
        $em->persist($juzgado);
        $em->flush();       
    }

    public function delete(Juzgado $juzgado): void
    {
        $em = $this->getEntityManager();
        $em->remove($juzgado);
        $em->flush(); 
    }
}
