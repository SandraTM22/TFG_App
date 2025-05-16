<?php

namespace App\Form;

use App\Entity\Contrario;
use App\Entity\Expediente;
use App\Entity\Juzgado;
use App\Entity\Procurador;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ExpedienteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('descripcion')
            ->add('autos')
            ->add('estado')
            ->add('tipoProcedimiento')
            ->add('restitucionEconomica')
            ->add('contrario', EntityType::class, [
                'class' => Contrario::class,
                'choice_label' => 'id',
            ])
            ->add('juzgado', EntityType::class, [
                'class' => Juzgado::class,
                'choice_label' => 'id',
            ])
            ->add('procurador', EntityType::class, [
                'class' => Procurador::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Expediente::class,
            'csrf_protection' => false,
        ]);
    }
}
