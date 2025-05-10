<?php
namespace App\Form;

use App\Entity\Direccion;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DireccionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('calle')
            ->add('numero')
            ->add('cp')
            ->add('localidad')
            ->add('provincia')
            ->add('pais')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Direccion::class,
            'csrf_protection' => false,
        ]);
    }
}
