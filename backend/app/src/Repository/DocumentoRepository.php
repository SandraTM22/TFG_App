<?php

namespace App\Repository;

use App\Entity\Documento;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Documentos>
 */
class DocumentoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Documento::class);
    }

    public function save(Documento $documento): void
    {
        $em = $this->getEntityManager();
        $em->persist($documento);
        $em->flush();       
    }

    public function delete(Documento $documento): void
    {
        $em = $this->getEntityManager();
        $em->remove($documento);
        $em->flush(); 
    }
}
