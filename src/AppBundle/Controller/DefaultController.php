<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Faction;
use AppBundle\Entity\Individu;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Common\Collections\ArrayCollection;
class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {

        $listFaction = $this->getDoctrine()->getRepository(Faction::class)->findAll();

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'listFaction' => $listFaction,
            'listCommandant' => null,
            'listUnite' => null,
            'listNCU' => null
        ]);
    }


    public function getListFaction()
    {
        return $this->getDoctrine()->getRepository(Faction::class)->findAll();
    }


    /**
     * @Route("/ajaxGetListIndividus", name="ajaxGetListIndividus")
     */
    public function getListIndividus(Request $request)
    {
        //type => 1 général , 2 unité, 3 attach, 4 NCU
        //typeIndividu 1 infanterie, 2 CAvaleire, 3 Monstre, 4 ncu
        //faction starr = 1 et lanniseter 2

         $faction[] = $request->get('faction');
         $type[] = $request->get('type');
         if($request->get('type' )== 3)
         {
             $typeIndividu = [1,2]; //on ajoute les type 1 (générals) et typeIndividu 1(infaterie), 2(Cavalerie)
             $listUCCmd = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => 1, 'typeIndividu' =>  $typeIndividu]);
         }

         if($request->get('type' )== 4)
         {
             $typeIndividu = [4]; //on ajoute les type 1 (générals) et typeIndividu 1(infaterie), 2(Cavalerie)
             $listUCNUC = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => 1, 'typeIndividu' =>  $typeIndividu]);
         }

         //add neutre
         if(($request->get('type') == 2 or $request->get('type') == 3 or $request->get('type') == 4) && ($request->get('faction') == 1 or $request->get('faction') == 2))
           $faction[] = "3";

        $listUC = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => $type ]);

        if(isset($listUCCmd))
            $listUC = new ArrayCollection(
                array_merge($listUCCmd, $listUC)
            );

        if(isset($listUCNUC))
            $listUC = new ArrayCollection(
                array_merge($listUCNUC, $listUC)
            );



        $manager = $this->get('assets.packages');
        $arrayCollection = array();
        foreach($listUC as $uc) {
            $arrayCollection[] = array(
                'id' => $uc->getId(),
                'nom' => $uc->getNom(),
                'cout' => $uc->getCout(),
                'pathVerso' => $manager->getUrl('bundles/app/images/uniteus/').$uc->getPathVersoPicture(),
                'typeIndividu' => $uc->getTypeIndividu()->getNom(),
                'isUnique' => $uc->getIsUnique()
            );
        }

        return new JsonResponse($arrayCollection);
    }

    /**
     * @Route("/ajaxGetInfoIndividu", name="ajaxGetInfoIndividu")
     */
    public function getInfoIndividu(Request $request)
    {
        $indivu = $this->getDoctrine()->getRepository(Individu::class)->findOneById($request->get('id'));

        if(!empty($request->get('idChild')))
            $indivuAttch = $this->getDoctrine()->getRepository(Individu::class)->findOneById($request->get('idChild'));

        $infoIndividu = array(
            'id' => $indivu->getId(),
            'nom' => $indivu->getNom(),
            'cout' => $indivu->getCout(),
            'typeIndividu' => $indivu->getTypeIndividu()->getNom(),
            'coutAttch' => (isset($indivuAttch)?$indivuAttch->getCout():0)
        );

        return new JsonResponse($infoIndividu);

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
            $selectTotReturn .= '<option value="'.$attachment->getId().'" data-cout='.$attachment->getCout().' data-typeunite="'.$attachment->getTypeIndividu()->getId().'"  data-isunique="'.$attachment->getIsUnique().'" >';
            $selectTotReturn .=  $attachment->getNom().'('.$attachment->getCout().')';
            $selectTotReturn .= '</option>';
        }

        return new Response($selectTotReturn);
    }
}
