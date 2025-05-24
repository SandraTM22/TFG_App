<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
// Valida unicidad de email antes de flush
#[UniqueEntity(
    fields: ['email'],
    message: 'Ya existe un usuario registrado con este email.'
)]

class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'El nombre de usuario no puede estar vacío')]
    #[Assert\Length(
        max: 180,
        maxMessage: 'El nombre de usuario no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $name = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'El email no puede estar vacío')]
    #[Assert\Email(message: 'El email "{{ value }}" no es un email válido')]
    #[Assert\Length(
        max: 180,
        maxMessage: 'El email no puede tener más de {{ limit }} caracteres'
    )]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column(type: 'json', nullable: false)]
    private array $roles = [];

    //Roles permitidos = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER_LIMITED'];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank(message: 'La contraseña no puede estar vacía')]
    #[Assert\Length(
        min: 8,
        max: 255,
        minMessage: 'La contraseña debe tener al menos {{ limit }} caracteres',
        maxMessage: 'La contraseña no puede exceder {{ limit }} caracteres'
    )]
    private ?string $password = null;

    #[ORM\Column]
    private ?bool $active = true;

    /**
     * @var Collection<int, Notas>
     */
    #[ORM\OneToMany(targetEntity: Nota::class, mappedBy: 'usuario')]
    private Collection $notas;

    public function __construct()
    {
        $this->notas = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getactive(): ?bool
    {
        return $this->active;
    }

    public function setactive(bool $active): static
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return Collection<int, Notas>
     */
    public function getNotas(): Collection
    {
        return $this->notas;
    }

    public function addNota(Nota $nota): static
    {
        if (!$this->notas->contains($nota)) {
            $this->notas->add($nota);
            $nota->setUsuario($this);
        }

        return $this;
    }

    public function removeNota(Nota $nota): static
    {
        if ($this->notas->removeElement($nota)) {
            // set the owning side to null (unless already changed)
            if ($nota->getUsuario() === $this) {
                $nota->setUsuario(null);
            }
        }

        return $this;
    }
}
