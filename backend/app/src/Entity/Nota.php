<?php

namespace App\Entity;

use App\Repository\NotaRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: NotaRepository::class)]
class Nota
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Assert\Length(
        max: 1000,
        maxMessage: "El contenido no puede superar los {{ limit }} caracteres"
    )]
    #[Assert\NotBlank(message: "El contenido no puede estar vacío")]
    private ?string $contenido = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull(message: "La fecha no puede ser nula")]
    private ?\DateTimeInterface $fecha = null;

    #[ORM\ManyToOne(inversedBy: 'notas')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: "Debe de tener un usuario asociado")]
    private ?User $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'notas')]
    private ?Cliente $cliente = null;

    #[ORM\ManyToOne(inversedBy: 'notasJ')]
    private ?Juzgado $juzgado = null;

    #[ORM\ManyToOne(inversedBy: 'notas')]
    private ?Expediente $expediente = null;

    #[ORM\ManyToOne(targetEntity: Costas::class, inversedBy: 'notas')]
    #[ORM\JoinColumn(nullable: true)]
    private ?Costas $costa = null;


    public function __construct()
    {
        $this->fecha = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenido(): ?string
    {
        return $this->contenido;
    }

    public function setContenido(?string $contenido): static
    {
        $this->contenido = $contenido;

        return $this;
    }

    public function getFecha(): ?\DateTimeInterface
    {
        return $this->fecha;
    }

    public function setFecha(\DateTimeInterface $fecha): static
    {
        $this->fecha = $fecha;

        return $this;
    }

    public function getUsuario(): ?User
    {
        return $this->usuario;
    }

    public function setUsuario(?User $usuario): static
    {
        $this->usuario = $usuario;

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

    public function getJuzgado(): ?Juzgado
    {
        return $this->juzgado;
    }

    public function setJuzgado(?Juzgado $juzgado): static
    {
        $this->juzgado = $juzgado;

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

    public function getCosta(): ?Costas
    {
        return $this->costa;
    }

    public function setCosta(?Costas $costa): self
    {
        $this->costa = $costa;
        return $this;
    }
}
