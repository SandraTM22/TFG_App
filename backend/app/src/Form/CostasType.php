<?php

namespace App\Form;

use App\Entity\Costas;
use App\Enum\EstadoCobro;
use App\Enum\EstadoCostas;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\CallbackTransformer;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CostasType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('estado', TextType::class, ['required' => true]);

        $builder->get('estado')
            ->addModelTransformer(new CallbackTransformer(
                fn(?EstadoCostas $enum) => $enum?->value,
                fn(?string $value) => $value !== null && $value !== '' ? EstadoCostas::from($value) : null
            ));


        $builder
            ->add('fechaTC', DateType::class, [
                'widget'   => 'single_text',
                'required' => false,
            ])
            ->add('fecha15TC', DateType::class, [
                'widget'   => 'single_text',
                'required' => false,
            ])
            ->add('fechaDecreto', DateType::class, [
                'widget'   => 'single_text',
                'required' => false,
            ])
            ->add('fecha20Decreto', DateType::class, [
                'widget'   => 'single_text',
                'required' => false,
            ])
            ->add('importe', NumberType::class, [
                'required' => false,
                'scale'    => 2,
            ])
        ;
        $builder
            ->add('estadoCobro', TextType::class, ['required' => true]);

        $builder->get('estadoCobro')
            ->addModelTransformer(new CallbackTransformer(
                fn(?EstadoCobro $enum) => $enum?->value,
                fn(?string $value) => $value !== null && $value !== '' ? EstadoCobro::from($value) : null
            ));
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class'      => Costas::class,
            'csrf_protection' => false,
        ]);
    }
}
