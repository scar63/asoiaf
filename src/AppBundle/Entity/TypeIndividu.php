<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * TypeIndividu
 *
 * @ORM\Table(name="type_individu")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TypeIndividuRepository")
 */
class TypeIndividu
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nom
     *
     * @param string $nom
     *
     * @return TypeIndividu
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string
     */
    public function getNom($locale = null)
    {
        if(!empty($locale))
        {
            if($locale == 'en' )
            {
                switch ($this->nom) {
                    case 'Infanterie':
                        $this->setNom('Infantry');
                        break;
                    case 'Cavalerie':
                        $this->setNom('Cavalry');
                        break;
                    case 'Monstre':
                        $this->setNom('Monster');
                        break;
                    case 'Machine de guerre':
                        $this->setNom('War Machine');
                        break;
                }
            }

            if($locale == 'es' )
            {
                switch ($this->nom) {
                    case 'Infanterie':
                        $this->setNom('Infantería');
                        break;
                    case 'Cavalerie':
                        $this->setNom('Caballería');
                        break;
                    case 'Monstre':
                        $this->setNom('Monstruo');
                        break;
                    case 'Machine de guerre':
                        $this->setNom('Máquina de guerra');
                        break;
                }
            }


            return $this->nom;
        }

        return $this->nom;
    }

    public function __toString() {
        return $this->nom;
    }
}
