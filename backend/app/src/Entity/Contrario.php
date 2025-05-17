<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ContrarioRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ContrarioRepository::class)]
#[ApiResource]
#[UniqueEntity('nif', message: 'Este NIF ya existe.')]

class Contrario
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

    #[ORM\Column(length: 20, nullable: true, unique: true)]
    #[Assert\Length(
        max: 20,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $nif = null;

    #[ORM\ManyToOne(targetEntity: Direccion::class, inversedBy: 'contrarios',cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: true)]
    private ?Direccion $direccion = null;

    /**
     * @var Collection<int, Expediente>
     */
    #[ORM\OneToMany(targetEntity: Expediente::class, mappedBy: 'contrario')]
    private Collection $expedientes;

    public function __construct()
    {
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

    public function getNif(): ?string
    {
        return $this->nif;
    }

    public function setNif(?string $nif): static
    {
        $this->nif = $nif;

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
            $expediente->setContrario($this);
        }

        return $this;
    }

    public function removeExpediente(Expediente $expediente): static
    {
        if ($this->expedientes->removeElement($expediente)) {
            // set the owning side to null (unless already changed)
            if ($expediente->getContrario() === $this) {
                $expediente->setContrario(null);
            }
        }

        return $this;
    }
}
