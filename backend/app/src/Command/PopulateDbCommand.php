<?php

namespace App\Command;

use App\Entity\Cliente;
use App\Entity\Contrario;
use App\Entity\Costas;
use App\Entity\Documento;
use App\Entity\Direccion;
use App\Entity\Expediente;
use App\Entity\Juzgado;
use App\Entity\Nota;
use App\Entity\Procurador;
use App\Entity\User;
use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory as FakerFactory;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:populate-db',
    description: 'Popula la base de datos con datos de prueba usando Faker.'
)]
class PopulateDbCommand extends Command
{
    private const ROLE_CHOICES = ['ROLE_USER', 'ROLE_USER_LIMITED'];

    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $faker = FakerFactory::create('es_ES');
        $this->em->beginTransaction();
        try {
            //Usuarios con rol aleatorio
            $output->writeln('<info>Creando usuarios...</info>');
            $users = [];
            for ($i = 0; $i < 15; $i++) {
                $u = new User();
                $u->setName($faker->userName())
                    ->setEmail($faker->unique()->safeEmail());
                // elegir un rol al azar
                $randomRole = self::ROLE_CHOICES[array_rand(self::ROLE_CHOICES)];
                $u->setRoles([$randomRole]);
                $u->setPassword(password_hash('password', PASSWORD_BCRYPT));
                $this->em->persist($u);
                $users[] = $u;
            }
            
            // Procuradores con Direccion
            $output->writeln('<info>Creando procuradores...</info>');
            $procuradores = [];
            for ($i = 0; $i < 15; $i++) {
                $dir = new Direccion();
                $dir->setCalle($faker->streetName())
                    ->setNumero($faker->randomDigitNotZero())
                    ->setCp((int)$faker->postcode())
                    ->setLocalidad($faker->city())
                    ->setProvincia($faker->state())
                    ->setPais($faker->country());
                $this->em->persist($dir);

                $p = new Procurador();
                $p->setNombre($faker->firstName())
                    ->setApellido1($faker->lastName())
                    ->setApellido2($faker->lastName())
                    ->setColegio('Colegio ' . $faker->city())
                    ->setNumeroColegiado($faker->unique()->numberBetween(1, 9999))
                    ->setDireccion($dir);
                $this->em->persist($p);
                $procuradores[] = $p;
            }

            //Contrarios con Direccion propia
            $output->writeln('<info>Creando contrarios...</info>');
            $contrarios = [];
            for ($i = 0; $i < 15; $i++) {
                $dir = new Direccion();
                $dir->setCalle($faker->streetName())
                    ->setNumero($faker->randomDigitNotZero())
                    ->setCp((int)$faker->postcode())
                    ->setLocalidad($faker->city())
                    ->setProvincia($faker->state())
                    ->setPais($faker->country());
                $this->em->persist($dir);

                $c = new Contrario();
                $c->setNombre($faker->company())
                    ->setNif(strtoupper($faker->bothify('??######?')))
                    ->setDireccion($dir);
                $this->em->persist($c);
                $contrarios[] = $c;
            }

            // Clientes con Direccion
            $output->writeln('<info>Creando clientes...</info>');
            $clientes = [];
            for ($i = 0; $i < 15; $i++) {
                $dir = new Direccion();
                $dir->setCalle($faker->streetName())
                    ->setNumero($faker->randomDigitNotZero())
                    ->setCp((int)$faker->postcode())
                    ->setLocalidad($faker->city())
                    ->setProvincia($faker->state())
                    ->setPais('España');
                $this->em->persist($dir);

                $cl = new Cliente();
                $cl->setNombre($faker->firstName())
                    ->setApellido1($faker->lastName())
                    ->setApellido2($faker->lastName())
                    ->setDni($faker->optional()->bothify('########?'))
                    ->setReferencia($faker->sentence(3, true))
                    ->setDireccion($dir);
                $this->em->persist($cl);
                $clientes[] = $cl;
            }

            //Juzgados con Direccion
            $output->writeln('<info>Creando juzgados...</info>');
            $juzgados = [];
            for ($i = 0; $i < 15; $i++) {
                $dir = new Direccion();
                $dir->setCalle($faker->streetName())
                    ->setNumero($faker->randomDigitNotZero())
                    ->setCp((int)$faker->postcode())
                    ->setLocalidad($faker->city())
                    ->setProvincia($faker->state())
                    ->setPais($faker->country());
                $this->em->persist($dir);

                $j = new Juzgado();
                $j->setNombre($faker->city())
                    ->setDireccion($dir);
                $this->em->persist($j);
                $juzgados[] = $j;
            }

            //Expedientes
            $output->writeln('<info>Creando expedientes...</info>');
            $expedientes = [];
            for ($i = 0; $i < 15; $i++) {
                $e = new Expediente();
                $e->setCliente($faker->randomElement($clientes))
                    ->setContrario($faker->randomElement($contrarios))
                    ->setJuzgado($faker->randomElement($juzgados))
                    ->setProcurador($faker->randomElement($procuradores))
                    ->setAutos($faker->bothify('####/2025'))
                    ->setEstado($faker->randomElement(EstadoCostas::cases())->value)
                    ->setTipoProcedimiento($faker->word())
                    ->setRestitucionEconomica($faker->optional()->sentence())
                    ->setDescripcion($faker->sentence(6));
                $this->em->persist($e);
                $expedientes[] = $e;
            }

            //Notas
            $output->writeln('<info>Creando notas...</info>');
            for ($i = 0; $i < 15; $i++) {
                $n = new Nota();
                $n->setContenido($faker->text(100))
                    ->setFecha($faker->dateTimeBetween('-1 years'))
                    ->setUsuario($faker->randomElement($users));
                // asignar relación aleatoria
                $relation = $faker->randomElement(['Cliente', 'Juzgado', 'Expediente']);
                $method = 'set' . $relation;
                $collection = strtolower($relation) . 's';
                $items = ${lcfirst($collection)};
                $n->$method($faker->randomElement($items));
                $this->em->persist($n);
            }

            //Documentos
            $output->writeln('<info>Creando documentos...</info>');
            for ($i = 0; $i < 15; $i++) {
                $d = new Documento();
                $d->setNombre($faker->word() . '.pdf')
                    ->setTipo('pdf')
                    ->setRuta('/files/' . $faker->uuid() . '.pdf')
                    ->setExpediente($faker->randomElement($expedientes));
                $this->em->persist($d);
            }

            //Costas
            $output->writeln('<info>Creando costas...</info>');
            foreach ($expedientes as $e) {
                for ($j = 0; $j < 2; $j++) {
                    $c = new Costas();
                    $start = $faker->dateTimeBetween('-3 months');
                    $c->setFechaTC($start)
                        ->setFecha15TC((clone $start)->modify('+15 days'))
                        ->setFechaDecreto((clone $start)->modify('+30 days'))
                        ->setFecha20Decreto((clone $start)->modify('+50 days'))
                        ->setEstado($faker->randomElement(EstadoCostas::cases()))
                        ->setEstadoCobro($faker->randomElement(EstadoCobro::cases()))
                        ->setImporte($faker->randomFloat(2, 0, 5000))
                        ->setExpediente($e);
                    $this->em->persist($c);
                    $costas[] = $c;
                }
            }

            $output->writeln('<info>Creando notas de costas...</info>');
            for ($i = 0; $i < 15; $i++) {
                $n = new Nota();
                $n->setContenido($faker->text(100))
                    ->setFecha($faker->dateTimeBetween('-1 years'))
                    ->setUsuario($faker->randomElement($users))
                    // elegimos una costa aleatoria
                    ->setCosta($faker->randomElement($costas));
                $this->em->persist($n);
            }


            $this->em->flush();
            $this->em->commit();

            $output->writeln('<info>Datos de prueba generados correctamente.</info>');
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->em->rollback();
            $output->writeln('<error>Error al poblar la base de datos: ' . $e->getMessage() . '</error>');
            return Command::FAILURE;
        }
    }
}
