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
     * @var string
     *
     * @ORM\Column(name="nomFr", type="string", length=255, nullable=true)
     */
    private $nomFr;

    /**
     * @var string
     *
     * @ORM\Column(name="nomEs", type="string", length=255, nullable=true)
     */
    private $nomEs;

    /**
     * @var int
     *
     * @ORM\Column(name="cout", type="integer", options={"default" : 0})
     */
    private $cout;

    /**
     * @ORM\ManyToOne(targetEntity="Individu", inversedBy="attachId")
     * @ORM\JoinColumn(referencedColumnName="id", nullable=true)
     */
    private $attachId;

    /**
     * @var bool
     *
     * @ORM\Column(name="isUnique", type="boolean")
     */
    private $isUnique;

    /**
     * @var string
     *
     * @ORM\Column(name="pathRectoPicture", type="string", length=500, nullable=true)
     */
    private $pathRectoPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="pathVersoPicture", type="string", length=500, nullable=true)
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
     * @var string
     *
     * @ORM\Column(name="personnageRealName", type="string", length=500, nullable=true)
     */
    private $personnageRealName;

    /**
     * @var bool
     *
     * @ORM\Column(name="isOnlySetWhenAttach", type="boolean" , options={"default" : false})
     */
    private $isOnlySetWhenAttach;

    /**
     * @var bool
     *
     * @ORM\Column(name="isOnlySetWhenCmdSelect", type="boolean" , options={"default" : false})
     */
    private $isOnlySetWhenCmdSelect;

    /**
     * @var string
     *
     * @ORM\Column(name="libelleSpecial", type="string", length=500, nullable=true)
     */
    private $libelleSpecial;


    /**
     * @var string
     *
     * @ORM\Column(name="$pathTactilCardFirst", type="string", length=500, nullable=true)
     */
    private $pathTactilCardFirst;

     /**
     * @var string
     *
     * @ORM\Column(name="$pathTactilCardSecond", type="string", length=500, nullable=true)
     */
    private $pathTactilCardSecond;

     /**
     * @var string
     *
     * @ORM\Column(name="$pathTactilCardThird", type="string", length=500, nullable=true)
     */
    private $pathTactilCardThird;

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
        return str_replace("'", "_", $this->pathRectoPicture);
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
        return  str_replace("'", "_",$this->pathVersoPicture);
    }

    /**
     * Set nomFr
     *
     * @param string $nomFr
     *
     * @return Individu
     */
    public function setNomFr($nomFr)
    {
        $this->nomFr = $nomFr;

        return $this;
    }

    /**
     * Get nomFr
     *
     * @return string
     */
    public function getNomFr()
    {
        return $this->nomFr;
    }

    /**
     * Set nomEs
     *
     * @param string $nomEs
     *
     * @return Individu
     */
    public function setNomEs($nomEs)
    {
        $this->nomEs = $nomEs;

        return $this;
    }

    /**
     * Get nomEs
     *
     * @return string
     */
    public function getNomEs()
    {
        return $this->nomEs;
    }

    /**
     * @return string
     */
    public function getPersonnageRealName()
    {
        return $this->personnageRealName;
    }

    /**
     * @param string $personnageRealName
     */
    public function setPersonnageRealName($personnageRealName)
    {
        $this->personnageRealName = $personnageRealName;
    }


    /**
     * @return bool
     */
    public function isOnlySetWhenAttach()
    {
        return $this->isOnlySetWhenAttach;
    }

    /**
     * @param bool $isOnlySetWhenAttach
     */
    public function setIsOnlySetWhenAttach($isOnlySetWhenAttach)
    {
        $this->isOnlySetWhenAttach = $isOnlySetWhenAttach;
    }

    /**
     * @return int
     */
    public function getAttachId()
    {
        return $this->attachId;
    }

    /**
     * @param int $attachId
     */
    public function setAttachId($attachId)
    {
        $this->attachId = $attachId;
    }

    /**
     * @return string
     */
    public function getLibelleSpecial()
    {
        return $this->libelleSpecial;
    }

    /**
     * @param string $personnageRealName
     */
    public function setLibelleSpecial($libelleSpecial)
    {
        $this->libelleSpecial = $libelleSpecial;
    }

    /**
     * @return bool
     */
    public function isOnlySetWhenCmdSelect()
    {
        return $this->isOnlySetWhenCmdSelect;
    }

    /**
     * @param bool $isOnlySetWhenCmdSelect
     */
    public function setIsOnlySetWhenCmdSelect($isOnlySetWhenCmdSelect)
    {
        $this->isOnlySetWhenCmdSelect = $isOnlySetWhenCmdSelect;
    }

    public function __toString() {
        return $this->nom;
    }

    /**
     * @return string
     */
    public function getPathTactilCardFirst()
    {
        return $this->pathTactilCardFirst;
    }

    /**
     * @param string $pathTactilCardFirst
     */
    public function setPathTactilCardFirst($pathTactilCardFirst)
    {
        $this->pathTactilCardFirst = $pathTactilCardFirst;
    }

    /**
     * @return string
     */
    public function getPathTactilCardSecond()
    {
        return $this->pathTactilCardSecond;
    }

    /**
     * @param string $pathTactilCardSecond
     */
    public function setPathTactilCardSecond($pathTactilCardSecond)
    {
        $this->pathTactilCardSecond = $pathTactilCardSecond;
    }

    /**
     * @return string
     */
    public function getPathTactilCardThird()
    {
        return $this->pathTactilCardThird;
    }

    /**
     * @param string $pathTactilCardThird
     */
    public function setPathTactilCardThird($pathTactilCardThird)
    {
        $this->pathTactilCardThird = $pathTactilCardThird;
    }

}
