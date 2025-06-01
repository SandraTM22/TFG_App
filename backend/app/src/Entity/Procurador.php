<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProcuradorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Direccion;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: ProcuradorRepository::class)]
//Creo un indice unico
#[ORM\Table(
    name: 'procurador',
    uniqueConstraints: [
        new UniqueConstraint(
            name: 'uniq_colegio_numero',
            columns: ['colegio', 'numero_colegiado']
        )
    ]
)]
//antes de persistir, comprobar que no exista otro igual
#[UniqueEntity(
    fields: ['colegio', 'numeroColegiado'],
    message: 'Ya existe un procurador con ese mismo colegio y número de colegiado'
)]
#[ApiResource]
class Procurador
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El nombre no puede estar vacío')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $nombre = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El apellido no puede estar vacío')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $apellido1 = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El apellido no puede estar vacío')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $apellido2 = null;


    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'El colegio no puede estar vacío')]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $colegio = null;

    #[ORM\Column]
    #[Assert\Positive(message: 'El número de colegiado debe ser mayor que cero')]
    private ?int $numeroColegiado = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Direccion $direccion = null;


    /**
     * @var Collection<int, Expediente>
     */
    #[ORM\OneToMany(targetEntity: Expediente::class, mappedBy: 'procurador')]
    private Collection $expedientes;

    public function __construct()
    {
        $this->expedientes = new ArrayCollection();
        $this->direccion = new Direccion();
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

    public function getColegio(): ?string
    {
        return $this->colegio;
    }

    public function setColegio(string $colegio): static
    {
        $this->colegio = $colegio;

        return $this;
    }

    public function getNumeroColegiado(): ?int
    {
        return $this->numeroColegiado;
    }

    public function setNumeroColegiado(int $numeroColegiado): static
    {
        $this->numeroColegiado = $numeroColegiado;

        return $this;
    }

    public function getDireccion(): ?Direccion
    {
        return $this->direccion;
    }

    public function setDireccion(?Direccion $direccion): self
    {
        $this->direccion = $direccion;
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
            $expediente->setProcurador($this);
        }

        return $this;
    }

    public function removeExpediente(Expediente $expediente): static
    {
        if ($this->expedientes->removeElement($expediente)) {
            // set the owning side to null (unless already changed)
            if ($expediente->getProcurador() === $this) {
                $expediente->setProcurador(null);
            }
        }

        return $this;
    }
}
