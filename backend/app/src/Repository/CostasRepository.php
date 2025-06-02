<?php

namespace App\Repository;

use App\Entity\Costas;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Costas>
 */
class CostasRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Costas::class);
    }
    public function save(Costas $costas): void
    {
        $em = $this->getEntityManager();
        $em->persist($costas);
        $em->flush();
    }

    public function delete(Costas $costas): void
    {
        $em = $this->getEntityManager();
        $em->remove($costas);
        $em->flush();
    }

    public function findAllExpCli(): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.expediente', 'e')
            ->addSelect('e')
            ->leftJoin('e.cliente', 'cl')
            ->addSelect('cl')
            ->orderBy('c.id', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
