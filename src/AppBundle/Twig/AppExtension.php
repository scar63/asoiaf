<?php


namespace AppBundle\Twig;


use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
class AppExtension extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('getLanguageSelect', [$this, 'getLanguageSelect']),
        ];
    }

    public function getLanguageSelect($local)
    {
        switch ($local) {
            case 'fr':
                return 'Français';
            case 'es':
                return 'Espagnol';
            case 'en':
                return 'Anglais';
        }
        return 'Français';
    }
}