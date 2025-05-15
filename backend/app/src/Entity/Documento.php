<?php

namespace App\Entity;

use App\Repository\DocumentoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DocumentoRepository::class)]
class Documento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "El nombre no puede estar vacío")]
    #[Assert\Length(
        max: 255,
        maxMessage: "El nombre no puede tener más de {{ limit }} caracteres"
    )]
    private ?string $nombre = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank(message: "El tipo no puede estar vacío")]
    #[Assert\Length(
        max: 20,
        maxMessage: "El tipo no puede tener más de {{ limit }} caracteres"
    )]
    private ?string $tipo = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: "La ruta no puede estar vacía")]
    private ?string $ruta = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull(message: "La fecha de subida no puede ser nula")]
    #[Assert\Type(
        type: \DateTimeInterface::class,
        message: "La fecha de subida debe ser una fecha válida"
    )]
    private ?\DateTimeInterface $fechaSubida = null;

    public function __construct()
    {
        $this->fechaSubida = new \DateTime();
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

    public function getTipo(): ?string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;

        return $this;
    }

    public function getRuta(): ?string
    {
        return $this->ruta;
    }

    public function setRuta(string $ruta): static
    {
        $this->ruta = $ruta;

        return $this;
    }

    public function getFechaSubida(): ?\DateTimeInterface
    {
        return $this->fechaSubida;
    }

    public function setFechaSubida(\DateTimeInterface $fechaSubida): static
    {
        $this->fechaSubida = $fechaSubida;

        return $this;
    }
}
