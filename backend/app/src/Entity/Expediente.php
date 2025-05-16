<?php

namespace App\Entity;

use App\Repository\ExpedienteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ExpedienteRepository::class)]
class Expediente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'expedientes')]
    private ?Contrario $contrario = null;

    #[ORM\ManyToOne(inversedBy: 'expedientes')]
    private ?Juzgado $juzgado = null;

    #[ORM\ManyToOne(inversedBy: 'expedientes')]
    private ?Procurador $procurador = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Assert\Length(
        max: 20,
        maxMessage: 'El campo autos no puede tener más de {{ limit }} caracteres.'
    )]
    private ?string $autos = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $estado = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Assert\Length(
        max: 50,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $tipoProcedimiento = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $restitucionEconomica = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull(message: "La fecha no puede ser nula")]
    private \DateTimeInterface $fechaCreacion;

    #[ORM\Column(length: 150)]
    #[Assert\NotNull(message: "La descripción no puede ser nula")]
    #[Assert\Length(
        max: 150,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $descripcion = null;

    public function __construct()
    {
        $this->fechaCreacion = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContrario(): ?Contrario
    {
        return $this->contrario;
    }

    public function setContrario(?Contrario $contrario): static
    {
        $this->contrario = $contrario;
        return $this;
    }

    public function getJuzgado(): ?Juzgado
    {
        return $this->juzgado;
    }

    public function setJuzgado(?Juzgado $juzgado): static
    {
        $this->juzgado = $juzgado;
        return $this;
    }

    public function getProcurador(): ?Procurador
    {
        return $this->procurador;
    }

    public function setProcurador(?Procurador $procurador): static
    {
        $this->procurador = $procurador;
        return $this;
    }

    public function getAutos(): ?string
    {
        return $this->autos;
    }

    public function setAutos(?string $autos): static
    {
        $this->autos = $autos;
        return $this;
    }

    public function getEstado(): ?string
    {
        return $this->estado;
    }

    public function setEstado(?string $estado): static
    {
        $this->estado = $estado;
        return $this;
    }

    public function getTipoProcedimiento(): ?string
    {
        return $this->tipoProcedimiento;
    }

    public function setTipoProcedimiento(?string $tipoProcedimiento): static
    {
        $this->tipoProcedimiento = $tipoProcedimiento;
        return $this;
    }

    public function getRestitucionEconomica(): ?string
    {
        return $this->restitucionEconomica;
    }

    public function setRestitucionEconomica(?string $restitucionEconomica): static
    {
        $this->restitucionEconomica = $restitucionEconomica;
        return $this;
    }

    public function getFechaCreacion(): \DateTimeInterface
    {
        return $this->fechaCreacion;
    }

    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): static
    {
        $this->fechaCreacion = $fechaCreacion;
        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }
}
