<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use App\Repository\CostasRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
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
    #[Groups(['costas:read', 'costas:write'])]
    private EstadoCostas $estado;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['costas:read', 'costas:write'])]
    private ?\DateTimeInterface $fechaTC = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['costas:read', 'costas:write'])]
    private ?\DateTimeInterface $fecha15TC = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['costas:read', 'costas:write'])]
    private ?\DateTimeInterface $fechaDecreto = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['costas:read', 'costas:write'])]
    private ?\DateTimeInterface $fecha20Decreto = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero(message: "El importe debe ser un número positivo o cero.")]
    #[Groups(['costas:read', 'costas:write'])]
    private ?float $importe = null;


    #[ORM\Column(enumType: EstadoCobro::class)]
    #[Assert\Choice(
        callback: [EstadoCobro::class, 'cases'],
        message: 'Estado inválido'
    )]
    #[Groups(['costas:read', 'costas:write'])]
    private EstadoCobro $estadoCobro;

    #[ORM\ManyToOne(inversedBy: 'costas')]
    #[Groups(['costas:read', 'costas:write'])]
    private ?Expediente $expediente = null;

    /**
     * @var Collection<int, Nota>
     */
    #[ORM\OneToMany(
        mappedBy: 'costa',
        targetEntity: Nota::class,
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    #[Groups(['costas:read'])]
    private Collection $notas;

    public function __construct()
    {
        $this->estado = EstadoCostas::SIN_TASAR;
        $this->estadoCobro = EstadoCobro::NO_COBRADAS;
        $this->notas = new ArrayCollection();
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

    public function getExpediente(): ?Expediente
    {
        return $this->expediente;
    }

    public function setExpediente(?Expediente $expediente): static
    {
        $this->expediente = $expediente;

        return $this;
    }

    /**
     * @return Collection<int, Nota>
     */
    public function getNotas(): Collection
    {
        return $this->notas;
    }

    public function addNota(Nota $nota): self
    {
        if (!$this->notas->contains($nota)) {
            $this->notas->add($nota);
            $nota->setCosta($this);
        }
        return $this;
    }

    public function removeNota(Nota $nota): self
    {
        if ($this->notas->removeElement($nota)) {
            // desvincula la nota
            if ($nota->getCosta() === $this) {
                $nota->setCosta(null);
            }
        }
        return $this;
    }
}
