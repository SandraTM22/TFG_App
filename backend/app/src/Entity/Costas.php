<?php

namespace App\Entity;

use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use App\Repository\CostasRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CostasRepository::class)]
class Costas
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(enumType: EstadoCostas::class)]
    #[Assert\Choice(
        callback: [EstadoCostas::class, 'cases'],
        message: 'Estado inválido'
    )]
    private EstadoCostas $estado;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaTC = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fecha15TC = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fechaDecreto = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $fecha20Decreto = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero(message: "El importe debe ser un número positivo o cero.")]
    private ?float $importe = null;

   
    #[ORM\Column(enumType: EstadoCobro::class)]
    #[Assert\Choice(
        callback: [EstadoCobro::class, 'cases'],
        message: 'Estado inválido'
    )]
    private EstadoCobro $estadoCobro;

    public function __construct() {
        $this->estado = EstadoCostas::SIN_TASAR;
        $this->estadoCobro = EstadoCobro::NO_COBRADAS;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEstado(): EstadoCostas
    {
        return $this->estado;
    }

    public function setEstado(EstadoCostas $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    public function getFechaTC(): ?\DateTimeInterface
    {
        return $this->fechaTC;
    }

    public function setFechaTC(?\DateTimeInterface $fechaTC): static
    {
        $this->fechaTC = $fechaTC;

        return $this;
    }

    public function getFecha15TC(): ?\DateTimeInterface
    {
        return $this->fecha15TC;
    }

    public function setFecha15TC(?\DateTimeInterface $fecha15TC): static
    {
        $this->fecha15TC = $fecha15TC;

        return $this;
    }

    public function getFechaDecreto(): ?\DateTimeInterface
    {
        return $this->fechaDecreto;
    }

    public function setFechaDecreto(?\DateTimeInterface $fechaDecreto): static
    {
        $this->fechaDecreto = $fechaDecreto;

        return $this;
    }

    public function getFecha20Decreto(): ?\DateTimeInterface
    {
        return $this->fecha20Decreto;
    }

    public function setFecha20Decreto(?\DateTimeInterface $fecha20Decreto): static
    {
        $this->fecha20Decreto = $fecha20Decreto;

        return $this;
    }

    public function getImporte(): ?float
    {
        return $this->importe;
    }

    public function setImporte(?float $importe): static
    {
        $this->importe = $importe;

        return $this;
    }

    public function getEstadoCobro(): EstadoCobro
    {
        return $this->estadoCobro;
    }

    public function setEstadoCobro(EstadoCobro $estadoCobro): static
    {
        $this->estadoCobro = $estadoCobro;

        return $this;
    }
}
