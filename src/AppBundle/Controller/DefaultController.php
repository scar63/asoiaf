<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Faction;
use AppBundle\Entity\Individu;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'listFaction' => $listFaction,
            'listCommandant' => null,
            'listUnite' => null,
            'listNCU' => null
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
            $selectTotReturn .= '<option value="'.$attachment->getId().'" data-cout='.$attachment->getCout().' data-typeunite="'.$attachment->getTypeIndividu()->getId().'"  data-isunique="'.$attachment->getIsUnique().'" >';
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
        $ul= '<ul class="listUC">';
        foreach($listUC as $uc)
        {
            $ul .= '<li>
                            <span class="row">'.$uc->getNom().'</span>
                            <span class="row">'.$uc->getCout().' points - '.$uc->getTypeIndividu()->getNom().'</span>
                            <span class="row text-center">
                                <button type="button" class="btn btn-primary btnAddUc" id="'.$uc->getId().'">
                                    Ajouter
                                </button>
                            </span>
                        </li>
                    <hr>';

            //$select .= '<option value='.$uc->getId().' data-cout='.$uc->getCout().'  data-typeunite="'.$uc->getTypeIndividu()->getId().'"
            //data-isunique='.$uc->getIsUnique().'>'.$uc->getNom().'(cout : '.$uc->getCout().', type: '.$uc->getTypeIndividu()->getNom().')</option>';
        }

        $ul .= '</ul>';

        return new Response($ul);
    }

    /**
     * @Route("/ajaxGetListNUC", name="ajaxGetListNUC")
     */
    public function getListNCU(Request $request)
    {
        $listNUC=  $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> [$request->get('faction')], 'type' => [$request->get('type')]] );
        //$select= '<option></option>';
        $ul= '<ul class="listNUC">';
        foreach($listNUC as $nuc)
        {
            $ul .= '<li>
                            <span class="row">'.$nuc->getNom().'</span>
                            <span class="row">'.$nuc->getCout().' points - '.$nuc->getTypeIndividu()->getNom().'</span>
                            <span class="row text-center">
                                <button type="button" class="btn btn-primary btnAddNUc" id="'.$nuc->getId().'">
                                    Ajouter
                                </button>
                            </span>
                        </li>
                    <hr>';
            //$select .= '<option value='.$nuc->getId().' data-cout='.$nuc->getCout().' data-typeunite="'.$nuc->getTypeIndividu()->getId().'"
            //data-isunique='.$nuc->getIsUnique().'>'.$nuc->getNom().'(cout : '.$nuc->getCout().')</option>';
        }

        return new Response($ul);
    }

    /**
     * @Route("/ajaxGetInfoIndividu", name="ajaxGetInfoIndividu")
     */
    public function getInfoIndividu(Request $request)
    {
        $indivu = $this->getDoctrine()->getRepository(Individu::class)->findOneById($request->get('id'));

        return new JsonResponse(['html'=>'<li><span class="col-lg-10">'.$indivu->getNom().
            ' ('.$indivu->getCout().')</span><span class="col-lg-1"><span class="glyphicon glyphicon-trash" 
            style="cursor: pointer" data-id="'.$indivu->getId().'"></span></li><br>', 'cout' => $indivu->getCout()]);
        //return new JsonResponse(['nom'=>$indivu->getNom(), 'cout' => $indivu->getCout()]);
    }
}
