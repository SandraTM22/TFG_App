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

    //    /**
    //     * @return Contrario[] Returns an array of Contrario objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Contrario
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
