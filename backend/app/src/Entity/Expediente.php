<?php

namespace App\Entity;

use App\Repository\ExpedienteRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\Column(type: 'datetime_immutable')]
    #[Assert\NotNull(message: "La fecha no puede ser nula")]
    private ?DateTimeImmutable $fechaCreacion = null;

    #[ORM\Column(length: 150,  nullable: true)]
    #[Assert\Length(
        max: 150,
        maxMessage: 'El valor no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $descripcion = null;

    #[ORM\ManyToOne(inversedBy: 'expedientes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Cliente $cliente = null;

    /**
     * @var Collection<int, Nota>
     */
    #[ORM\OneToMany(targetEntity: Nota::class, mappedBy: 'expediente')]
    private Collection $notas;

    /**
     * @var Collection<int, Documento>
     */
    #[ORM\OneToMany(targetEntity: Documento::class, mappedBy: 'expediente')]
    private Collection $documentos;

    /**
     * @var Collection<int, Costas>
     */
    #[ORM\OneToMany(targetEntity: Costas::class, mappedBy: 'expediente')]
    private Collection $costas;

    public function __construct()
    {
        $this->fechaCreacion = new \DateTimeImmutable();
        $this->notas = new ArrayCollection();
        $this->documentos = new ArrayCollection();
        $this->costas = new ArrayCollection();
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

    public function getFechaCreacion(): ?DateTimeImmutable
    {
        return $this->fechaCreacion;
    }

    public function setFechaCreacion(?DateTimeImmutable $fechaCreacion): static
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

    public function getCliente(): ?Cliente
    {
        return $this->cliente;
    }

    public function setCliente(?Cliente $cliente): static
    {
        $this->cliente = $cliente;

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
            $nota->setExpediente($this);
        }

        return $this;
    }

    public function removeNota(Nota $nota): static
    {
        if ($this->notas->removeElement($nota)) {
            // set the owning side to null (unless already changed)
            if ($nota->getExpediente() === $this) {
                $nota->setExpediente(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Documento>
     */
    public function getDocumentos(): Collection
    {
        return $this->documentos;
    }

    public function addDocumento(Documento $documento): static
    {
        if (!$this->documentos->contains($documento)) {
            $this->documentos->add($documento);
            $documento->setExpediente($this);
        }

        return $this;
    }

    public function removeDocumento(Documento $documento): static
    {
        if ($this->documentos->removeElement($documento)) {
            // set the owning side to null (unless already changed)
            if ($documento->getExpediente() === $this) {
                $documento->setExpediente(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Costas>
     */
    public function getCostas(): Collection
    {
        return $this->costas;
    }

    public function addCosta(Costas $costa): static
    {
        if (!$this->costas->contains($costa)) {
            $this->costas->add($costa);
            $costa->setExpediente($this);
        }

        return $this;
    }

    public function removeCosta(Costas $costa): static
    {
        if ($this->costas->removeElement($costa)) {
            // set the owning side to null (unless already changed)
            if ($costa->getExpediente() === $this) {
                $costa->setExpediente(null);
            }
        }

        return $this;
    }
}
