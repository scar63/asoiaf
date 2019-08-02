<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
class IndividuType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nom')->add('nomFr')->add('nomEs')->add('cout')
            ->add('isUnique')->add('pathRectoPicture')->add('pathVersoPicture')
            ->add('personnageRealName')->add('isOnlySetWhenAttach')->add('faction')
            ->add('type')->add('typeIndividu')->add('libelleSpecial', ChoiceType::class, [
                    'choices' => [
                        '' => null,
                        'Attaché à une unité adverse' => 'attachUnitAdverse',
                        'Fonctionne par 2' => 'processByTwo'
                    ]
                ]
            );
            //        ->add('attachId')
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Individu'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_individu';
    }


}
