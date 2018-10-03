<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Individu
 *
 * @ORM\Table(name="individu")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\IndividuRepository")
 */
class Individu
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
     * @var int
     *
     * @ORM\Column(name="cout", type="integer")
     */
    private $cout;

    /**
     * @var bool
     *
     * @ORM\Column(name="isUnique", type="boolean")
     */
    private $isUnique;

    /**
     * @var string
     *
     * @ORM\Column(name="pathRectoPicture", type="string", length=500)
     */
    private $pathRectoPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="pathVersoPicture", type="string", length=500)
     */
    private $pathVersoPicture;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Faction")
     * @ORM\JoinColumn(nullable=false)
     */
    private $faction;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Type")
     * @ORM\JoinColumn(nullable=false)
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\TypeIndividu")
     * @ORM\JoinColumn(nullable=false)
     */
    private $typeIndividu;

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
     * @return Individu
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
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set cout
     *
     * @param integer $cout
     *
     * @return Individu
     */
    public function setCout($cout)
    {
        $this->cout = $cout;

        return $this;
    }

    /**
     * Get cout
     *
     * @return int
     */
    public function getCout()
    {
        return $this->cout;
    }

    /**
     * Set faction
     *
     * @param \AppBundle\Entity\Faction $faction
     *
     * @return Individu
     */
    public function setFaction(\AppBundle\Entity\Faction $faction)
    {
        $this->faction = $faction;

        return $this;
    }

    /**
     * Get faction
     *
     * @return \AppBundle\Entity\Faction
     */
    public function getFaction()
    {
        return $this->faction;
    }

    /**
     * Set type
     *
     * @param \AppBundle\Entity\Type $type
     *
     * @return Individu
     */
    public function setType(\AppBundle\Entity\Type $type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return \AppBundle\Entity\Type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set typeIndividu
     *
     * @param \AppBundle\Entity\TypeIndividu $typeIndividu
     *
     * @return Individu
     */
    public function setTypeIndividu(\AppBundle\Entity\TypeIndividu $typeIndividu)
    {
        $this->typeIndividu = $typeIndividu;

        return $this;
    }

    /**
     * Get typeIndividu
     *
     * @return \AppBundle\Entity\TypeIndividu
     */
    public function getTypeIndividu()
    {
        return $this->typeIndividu;
    }

    /**
     * Set isUnique
     *
     * @param boolean $isUnique
     *
     * @return Individu
     */
    public function setIsUnique($isUnique)
    {
        $this->isUnique = $isUnique;

        return $this;
    }

    /**
     * Get isUnique
     *
     * @return boolean
     */
    public function getIsUnique()
    {
        return $this->isUnique;
    }

    /**
     * Set pathRectoPicture
     *
     * @param string $pathRectoPicture
     *
     * @return Individu
     */
    public function setPathRectoPicture($pathRectoPicture)
    {
        $this->pathRectoPicture = $pathRectoPicture;

        return $this;
    }

    /**
     * Get pathRectoPicture
     *
     * @return string
     */
    public function getPathRectoPicture()
    {
        return $this->pathRectoPicture;
    }

    /**
     * Set pathVersoPicture
     *
     * @param string $pathVersoPicture
     *
     * @return Individu
     */
    public function setPathVersoPicture($pathVersoPicture)
    {
        $this->pathVersoPicture = $pathVersoPicture;

        return $this;
    }

    /**
     * Get pathVersoPicture
     *
     * @return string
     */
    public function getPathVersoPicture()
    {
        return $this->pathVersoPicture;
    }
}
