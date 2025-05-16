<?php

namespace App\Repository;

use App\Entity\Expediente;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Expediente>
 */
class ExpedienteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Expediente::class);
    }


    public function save(Expediente $expediente): void
    {
        $em = $this->getEntityManager();
        $em->persist($expediente);
        $em->flush();
    }

    public function delete(Expediente $expediente): void
    {
        $em = $this->getEntityManager();
        $em->remove($expediente);
        $em->flush();
    }
}
