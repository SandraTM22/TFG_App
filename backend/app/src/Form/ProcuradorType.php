<?php

namespace App\Form;

use App\Entity\Direccion;
use App\Entity\Procurador;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProcuradorType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nombre')
            ->add('apellido1')
            ->add('apellido2')
            ->add('colegio')
            ->add('numeroColegiado')
            ->add('direccion', DireccionType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Procurador::class,
            'csrf_protection' => false,//Token de momento deshabilitado
        ]);
    }
}
