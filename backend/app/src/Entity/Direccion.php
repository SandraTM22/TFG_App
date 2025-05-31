<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DireccionRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: DireccionRepository::class)]
#[ApiResource]
class Direccion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'La calle no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $calle = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Positive(
        message: 'El número debe ser un valor entero positivo'
    )]
    private ?int $numero = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Regex(
        pattern: '/^\d{5}$/',
        message: 'El código postal debe tener 5 dígitos'
    )]
    private ?int $cp = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(
        max: 255,
        maxMessage: 'La localidad no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $localidad = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'La provincia es obligatoria'
    )]
    #[Assert\Length(
        max: 255,
        maxMessage: 'La provincia no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $provincia = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(
        message: 'El país es obligatorio'
    )]
    #[Assert\Length(
        max: 255,
        maxMessage: 'El país no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $pais = "España";

    #[ORM\OneToOne(mappedBy: 'direccion', targetEntity: Procurador::class)]
    private ?Procurador $procurador = null;


    #[ORM\OneToOne(mappedBy: 'direccion', targetEntity: Contrario::class)]
    private ?Contrario $contrario = null;

    #[ORM\OneToOne(mappedBy: 'direccion', targetEntity: Juzgado::class)]
    private ?Juzgado $juzgado = null;

    /**
     * Nuevo campo: “propiedad inversa” que sabe a qué Cliente pertenece.
     */
    #[ORM\OneToOne(
        mappedBy: 'direccion',
        targetEntity: Cliente::class
    )]
    private ?Cliente $cliente = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCalle(): ?string
    {
        return $this->calle;
    }

    public function setCalle(?string $calle): static
    {
        $this->calle = $calle;

        return $this;
    }

    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(?int $numero): static
    {
        $this->numero = $numero;

        return $this;
    }

    public function getCp(): ?int
    {
        return $this->cp;
    }

    public function setCp(?int $cp): static
    {
        $this->cp = $cp;

        return $this;
    }

    public function getLocalidad(): ?string
    {
        return $this->localidad;
    }

    public function setLocalidad(?string $localidad): static
    {
        $this->localidad = $localidad;

        return $this;
    }

    public function getProvincia(): ?string
    {
        return $this->provincia;
    }

    public function setProvincia(string $provincia): static
    {
        $this->provincia = $provincia;

        return $this;
    }

    public function getPais(): string
    {
        return $this->pais;
    }

    public function setPais(string $pais): static
    {
        $this->pais = $pais;

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

    public function getCliente(): ?Cliente
    {
        return $this->cliente;
    }

    public function setCliente(?Cliente $cliente): static
    {
        // Rompemos la referencia anterior si hace falta
        if ($this->cliente !== null && $cliente === null) {
            $this->cliente->setDireccion(null);
        }

        $this->cliente = $cliente;

        // Aseguramos bidireccionalidad: si estamos asociando a un Cliente
        if ($cliente !== null && $cliente->getDireccion() !== $this) {
            $cliente->setDireccion($this);
        }

        return $this;
    }
}
