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

    public function findByNombre(string $term): array
    {
        return $this->createQueryBuilder('c')
            ->where('LOWER(c.nombre) LIKE :term OR LOWER(c.apellido1) LIKE :term OR LOWER(c.apellido2) LIKE :term')
            ->setParameter('term', '%' . strtolower($term) . '%')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }

    public function existsByColegioAndNumero(string $colegio, int $numero): bool
    {
        $qb = $this->createQueryBuilder('p')
        ->select('COUNT(p.id)')
        ->where('LOWER(p.colegio) = :colegio')
        ->andWhere('p.numeroColegiado = :numero')
        ->setParameter('colegio', mb_strtolower($colegio))
        ->setParameter('numero', $numero);

    $count = (int) $qb->getQuery()->getSingleScalarResult();
    return $count > 0;
    }
}
