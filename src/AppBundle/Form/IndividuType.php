<?php

namespace AppBundle\Form;

use AppBundle\Entity\Individu;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
class IndividuType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nom')->add('nomFr')->add('nomEs')->add('cout')
            ->add('isUnique')->add('pathRectoPicture', FileType::class, ['mapped' => false, 'required' => false])
            ->add('pathVersoPicture', FileType::class, ['mapped' => false, 'required' => false])
            ->add('personnageRealName')->add('isOnlySetWhenAttach')->add('isOnlySetWhenCmdSelect')->add('attachId')->add('faction')
            ->add('type')->add('typeIndividu')->add('libelleSpecial', ChoiceType::class, [
                    'choices' => [
                        '' => null,
                        'Attaché à une unité adverse' => 'attachUnitAdverse',
                        'Fonctionne par 2' => 'processByTwo'
                    ]
                ]
            );
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
