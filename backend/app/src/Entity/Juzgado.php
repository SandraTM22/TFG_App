<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\JuzgadoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: JuzgadoRepository::class)]
#[ApiResource]
class Juzgado
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['expediente:read'])]
    private ?string $nombre = null;

    #[ORM\OneToOne(inversedBy: 'juzgado', cascade: ['persist', 'remove'])]
    private ?Direccion $direccion = null;    

    /**
     * @var Collection<int, Expediente>
     */
    #[ORM\OneToMany(targetEntity: Expediente::class, mappedBy: 'juzgado')]
    private Collection $expedientes;

    /**
     * @var Collection<int, Nota>
     */
    #[ORM\OneToMany(targetEntity: Nota::class, mappedBy: 'juzgado')]
    private Collection $notas;

    public function __construct()
    {
        $this->expedientes = new ArrayCollection();
        $this->notas = new ArrayCollection();
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
            $expediente->setJuzgado($this);
        }

        return $this;
    }

    public function removeExpediente(Expediente $expediente): static
    {
        if ($this->expedientes->removeElement($expediente)) {
            // set the owning side to null (unless already changed)
            if ($expediente->getJuzgado() === $this) {
                $expediente->setJuzgado(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Nota>
     */
    public function getNotas(): Collection
    {
        return $this->notas;
    }

    public function addNotas(Nota $notas): static
    {
        if (!$this->notas->contains($notas)) {
            $this->notas->add($notas);
            $notas->setJuzgado($this);
        }

        return $this;
    }

    public function removeNotas(Nota $notas): static
    {
        if ($this->notas->removeElement($notas)) {
            // set the owning side to null (unless already changed)
            if ($notas->getJuzgado() === $this) {
                $notas->setJuzgado(null);
            }
        }

        return $this;
    }
}
