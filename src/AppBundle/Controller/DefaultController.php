<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Faction;
use AppBundle\Entity\Individu;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {

        $listFaction = $this->getDoctrine()->getRepository(Faction::class)->findAll();

        $listCommandant = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction' => 1, 'type'=> 1]);

        $listUnite = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> [1], 'type' => [2]] );

        $listNCU = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> [1], 'type' => [4]] );

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'listFaction' => $listFaction,
            'listCommandant' => $listCommandant,
            'listUnite' => $listUnite,
            'listNCU' => $listNCU
        ]);
    }

    /**
     * @Route("/ajaxGetListAttachement", name="ajaxGetListAttachement")
     */
    public function ajaxGetListAttachement(Request $request)
    {

        $listAttachement = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction' => 1, 'type'=> 3, 'typeIndividu' => $request->get('idTypeIndividu')]);

        $selectTotReturn = '<option>Aucun</option>';

        foreach($listAttachement as $attachment)
        {
            $selectTotReturn .= '<option value="'.$attachment->getId().'" data-cout="'.$attachment->getCout().'" data-isunique="'.$attachment->getIsUnique().'" >';
            $selectTotReturn .=  $attachment->getNom().'('.$attachment->getCout().')';
            $selectTotReturn .= '</option>';
        }

        return new Response($selectTotReturn);
    }

    public function getListFaction()
    {
        return $this->getDoctrine()->getRepository(Faction::class)->findAll();
    }

    /**
     * @Route("/ajaxGetListCommandant", name="ajaxGetListCommandant")
     */
    public function getListCommandant(Request $request)
    {

        $listCommandant = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction' => $request->get('faction'), 'type'=>$request->get('type')]);

        $select= '<option></option>';
        foreach($listCommandant as $command)
        {
            $select .= '<option value='.$command->getId().' data-cout='.$command->getCout().' data-isunique='.$command->getIsUnique().'>'.$command->getNom().'</option>';
        }

        return new Response($select);
    }

    /**
     * @Route("/ajaxGetListUC", name="ajaxGetListUC")
     */
    public function getListUC(Request $request)
    {
        //type =>
        $listUC=  $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> [$request->get('faction')], 'type' => [$request->get('type')]] );

        $select= '<option></option>';
        foreach($listUC as $uc)
        {
            $select .= '<option value='.$uc->getId().' data-cout='.$uc->getCout().' data-isunique='.$uc->getIsUnique().'>'.$uc->getNom().'</option>';
        }

        return new Response($select);
    }

    /**
     * @Route("/ajaxGetListNUC", name="ajaxGetListNUC")
     */
    public function getListNCU(Request $request)
    {
        $listNUC=  $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> [$request->get('faction')], 'type' => [$request->get('type')]] );

        $select= '<option></option>';
        foreach($listNUC as $nuc)
        {
            $select .= '<option value='.$nuc->getId().' data-cout='.$nuc->getCout().' data-isunique='.$nuc->getIsUnique().'>'.$nuc->getNom().'</option>';
        }

        return new Response($select);
    }
}
