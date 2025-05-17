<?php

namespace App\Form;

use App\Entity\Cliente;
use App\Entity\Direccion;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ClienteType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nombre')
            ->add('apellido1')
            ->add('apellido2')
            ->add('dni')
            ->add('referencia')            
            ->add('direccion', EntityType::class, [
                'class' => Direccion::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Cliente::class,
            'csrf_protection' => false,
        ]);
    }
}
