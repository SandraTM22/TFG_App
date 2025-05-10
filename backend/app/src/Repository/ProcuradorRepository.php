<?php

namespace App\Repository;

use App\Entity\Procurador;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Procurador>
 */
class ProcuradorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Procurador::class);
    }
    public function save(Procurador $procurador): void
    {
        $em = $this->getEntityManager();
        $em->persist($procurador);
        $em->flush();       
    }

    public function delete(Procurador $procurador): void
    {
        $em = $this->getEntityManager();
        $em->remove($procurador);
        $em->flush(); 
    }
}
