<?php

namespace App\Entity;

use App\Repository\ClienteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ClienteRepository::class)]
#[UniqueEntity(fields: ['dni'], message: 'Ya existe un cliente con este DNI.')]
class Cliente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El nombre no puede estar vacío.')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El nombre no puede exceder {{ limit }} caracteres.'
    )]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El nombre no puede estar vacío.')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El nombre no puede exceder {{ limit }} caracteres.'
    )]
    private ?string $apellido1 = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El nombre no puede estar vacío.')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El nombre no puede exceder {{ limit }} caracteres.'
    )]
    private ?string $apellido2 = null;

    #[ORM\Column(length: 15, nullable: true, unique: true)]    
    #[Assert\Regex(
        pattern: '/^(?:[0-9]{8}|[XYZxyz][0-9]{7})[A-Za-z]$/',
        message: 'El DNI/NIE debe tener 8 dígitos y una letra, o empezar por X/Y/Z seguido de 7 dígitos y una letra.'
    )]
    private ?string $dni = null;

    #[ORM\ManyToOne(inversedBy: 'clientes')]
    private ?Direccion $direccion = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'La referencia no puede exceder {{ limit }} caracteres.'
    )]
    private ?string $referencia = null;

    /**
     * @var Collection<int, Nota>
     */
    #[ORM\OneToMany(targetEntity: Nota::class, mappedBy: 'cliente')]
    private Collection $notas;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull]
    private \DateTimeInterface $fechaCreacion;

    /**
     * @var Collection<int, Expediente>
     */
    #[ORM\OneToMany(targetEntity: Expediente::class, mappedBy: 'cliente')]
    private Collection $expedientes;

    public function __construct()
    {
        $this->notas = new ArrayCollection();
        $this->fechaCreacion = new \DateTime();
        $this->expedientes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getApellido1(): ?string
    {
        return $this->apellido1;
    }

    public function setApellido1(string $apellido1): static
    {
        $this->apellido1 = $apellido1;

        return $this;
    }

    public function getApellido2(): ?string
    {
        return $this->apellido2;
    }

    public function setApellido2(string $apellido2): static
    {
        $this->apellido2 = $apellido2;

        return $this;
    }

    public function getDni(): ?string
    {
        return $this->dni;
    }

    public function setDni(?string $dni): static
    {
        $this->dni = $dni;

        return $this;
    }

    public function getDireccion(): ?Direccion
    {
        return $this->direccion;
    }

    public function setDireccion(?Direccion $direccion): static
    {
        $this->direccion = $direccion;

        return $this;
    }

    public function getReferencia(): ?string
    {
        return $this->referencia;
    }

    public function setReferencia(?string $referencia): static
    {
        $this->referencia = $referencia;

        return $this;
    }

    /**
     * @return Collection<int, Nota>
     */
    public function getNotas(): Collection
    {
        return $this->notas;
    }

    public function addNota(Nota $nota): static
    {
        if (!$this->notas->contains($nota)) {
            $this->notas->add($nota);
            $nota->setCliente($this);
        }

        return $this;
    }

    public function removeNota(Nota $nota): static
    {
        if ($this->notas->removeElement($nota)) {
            // set the owning side to null (unless already changed)
            if ($nota->getCliente() === $this) {
                $nota->setCliente(null);
            }
        }

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

    /**
     * @return Collection<int, Expediente>
     */
    public function getExpedientes(): Collection
    {
        return $this->expedientes;
    }

    public function addExpediente(Expediente $expediente): static
    {
        if (!$this->expedientes->contains($expediente)) {
            $this->expedientes->add($expediente);
            $expediente->setCliente($this);
        }

        return $this;
    }

    public function removeExpediente(Expediente $expediente): static
    {
        if ($this->expedientes->removeElement($expediente)) {
            // set the owning side to null (unless already changed)
            if ($expediente->getCliente() === $this) {
                $expediente->setCliente(null);
            }
        }

        return $this;
    }
}
