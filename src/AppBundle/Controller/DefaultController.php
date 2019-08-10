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
     * @Route("/{_locale}/", requirements={"_locale":"%app.locales%"} , name="homepageLocale")
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
     * @Route("/ajaxGetAdversInclude", name="ajaxGetAdversInclude")
     */
    public function getAdversInclude(Request $request)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $query = $em->createQuery('SELECT i FROM AppBundle:Individu i WHERE i.faction in (:faction_id) and i.libelleSpecial = :libelleSpecial')
            ->setParameter('faction_id', $request->get('factionID'))
            ->setParameter('libelleSpecial', 'attachUnitAdverse');

        $infoIndividus = [];
        foreach ($query->getResult() as $indivu)
        {
            $infoIndividus [] = array(
                'id' => $indivu->getId(),
                'nom' => $indivu->getNom(),
                'cout' => $indivu->getCout(),
                'typeIndividu' => $indivu->getTypeIndividu()->getNom(),
                'typeIndividuId' => $indivu->getTypeIndividu()->getId(),
                'typeId' => $indivu->getType()->getId(),
                'coutAttch' => (isset($indivuAttch) ? $indivuAttch->getCout() : 0),
                'realName' => $indivu->getPersonnageRealName(),
                'hasAttachId' => $indivu->getAttachId(),
                'isOnlySetWhenAttach' => $indivu->isOnlySetWhenAttach(),
            );
        }

        return new JsonResponse($infoIndividus);
    }

    /**
     * @Route("/ajaxGetListIndividus", name="ajaxGetListIndividus")
     */
    public function getListIndividus(Request $request)
    {
        //type => 1 général , 2 unité, 3 attach, 4 NCU
        //typeIndividu 1 infanterie, 2 CAvaleire, 3 Monstre, 4 ncu
        //faction starr = 1 et lanniseter 2 neutre 3
        //attention cas uniquemnet set en attach (today type unite(2)/attach(3)) => 'isOnlySetWhenAttach' => false

         $faction[] = $request->get('faction');
         $type[] = $request->get('type');

         if($request->get('type' )== 4)
         {
             $typeIndividu = [4]; //on ajoute les type 1 (générals) et typeIndividu 1(infaterie), 2(Cavalerie)
             $listUCNUC = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => 1, 'typeIndividu' =>  $typeIndividu, 'isOnlySetWhenAttach' => false]);
         }

         //add faction neutre
         if(($request->get('type') != 1) && ($request->get('faction') != 3))
           $faction[] = "3";

         //si c'est un attachment alors on recup les général et indivdus avec le même typed'Individu que celui attaché
        if($request->get('type' )== 3)
        {
            $indivu = $this->getDoctrine()->getRepository(Individu::class)->findOneById($request->get('individuId'));
//            $typeIndividu = [$indivu->getTypeIndividu()->getId()];
            $typeIndividu = [1,2]; //corrige bug no list Boltons Cutthroats ?
            $type [] = 1; //on ajoute les type 1 (générals)
            $em = $this->getDoctrine()->getEntityManager();
            $query = $em->createQuery( 'SELECT i FROM AppBundle:Individu i WHERE i.faction in (:faction) and i.type in (:type) and i.typeIndividu in (:typeIndividu) and i.isOnlySetWhenAttach = :isOnlySetWhenAttach' )
                ->setParameter('faction', $faction)
                ->setParameter('type', $type)
                ->setParameter('typeIndividu', $typeIndividu)
                ->setParameter('isOnlySetWhenAttach', false);

            $listUC= $query->getResult();
        }
        //si commandant et faction non neutre alors on ajoute les commandant neutres
        elseif($request->get('type' )== 1)
        {
            if($faction != 3)
                $faction [] = 3;
            $listUC = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => $type, 'isOnlySetWhenAttach' => false ]);
        }
        else
            $listUC = $this->getDoctrine()->getRepository(Individu::class)->findBy(['faction'=> $faction, 'type' => $type, 'isOnlySetWhenAttach' => false ]);


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
                'pathRecto' => $manager->getUrl('bundles/app/images/uniteus/').$uc->getPathRectoPicture(),
                'typeIndividu' => $uc->getTypeIndividu()->getNom(),
                'type' => $uc->getType()->getId(),
                'isUnique' => $uc->getIsUnique(),
                'factionId' => $uc->getFaction()->getId(),
                'realName' => $uc->getPersonnageRealName(),
                'libelleSpecial' => $uc->getLibelleSpecial(),
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
            'typeIndividuId' => $indivu->getTypeIndividu()->getId(),
            'typeId' => $indivu->getType()->getId(),
            'coutAttch' => (isset($indivuAttch)?$indivuAttch->getCout():0),
            'realName' => $indivu->getPersonnageRealName(),
            'hasAttachId' => $indivu->getAttachId(),
            'isOnlySetWhenAttach' => $indivu->isOnlySetWhenAttach(),
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


    /**
     * @Route("/ajaxGeneratePDF", name="ajaxGeneratePDF")
     */
    public function ajaxGeneratePDf(Request $request)
    {
        $faction = $this->getDoctrine()->getRepository(Faction::class)->findOneBy(['id'=>$request->get('factionID')]);
        $cmd = $this->getDoctrine()->getRepository(Individu::class)->findOneBy(['id'=>$request->get('cmdID')]);

        $listNattachcID = $request->get('nattchID');

        $listPathUcTmp = [];
        $i=0;
        foreach($request->get('ucID') as $ucId)
        {
            $uc = $this->getDoctrine()->getRepository(Individu::class)->findOneBy(['id'=>$ucId]);

            $listPathUcTmp[$i][$ucId]['uc'] = $uc->getPathVersoPicture();

            if($listNattachcID)
            foreach ($listNattachcID as $nucID)
            {
                $ids =  explode('_', $nucID);
                $parentId = $ids[1];
                $attchId = $ids[0];
                if($parentId == $ucId)
                {
                    $nattchuc = $this->getDoctrine()->getRepository(Individu::class)->findOneBy(['id'=>$attchId]);
                    $listPathUcTmp[$i][$ucId]['nattchId'] = $nattchuc->getPathVersoPicture();
                }
            }
            $i++;
        }

        $listPathUc = array_chunk($listPathUcTmp, 2);

        if(count($listPathUcTmp) > 2 && count($listPathUcTmp) <= 7 )
            $listPathUc2 =  array_slice($listPathUcTmp, 2);
        elseif(count($listPathUcTmp) > 7 )
        {
            $listPathUc2Tmp =  array_chunk(array_slice($listPathUcTmp, 2),5 );
            $listPathUc2 = $listPathUc2Tmp[0];
            if(!empty( $listPathUc2Tmp[1]))
                $listPathUc3 = $listPathUc2Tmp[1];
        }

       $listPathNUc = [];
        foreach($request->get('nucID') as $nucID)
        {
            $uc = $this->getDoctrine()->getRepository(Individu::class)->findOneBy(['id'=>$nucID]);
            $listPathNUc[] = $uc->getPathVersoPicture();
        }

        $html = $this->renderView(':pdf:resume.html.twig',
            array(
                'pathCmdPicture' =>$cmd->getPathVersoPicture(),
                'listPathUc' =>$listPathUc[0],
                'listPathNUc' =>$listPathNUc,
                'nameFaction'  => $faction->getNom(),
                'armyPoint'  => $request->get('armyPoint'),
                'armyName'  => $request->get('armyName'),
            ));
        $footer = '<table width="100%" style="vertical-align: bottom; ">
                    <tr>
                        <td width="33%"></td>
                        <td width="33%" align="center"></td>
                        <td width="33%" style="text-align: right;margin-left: -5px;padding-left: -5px">{PAGENO}/{nbpg}</td>
                    </tr>
                </table>';
        $response = new Response();
        $mpdf = new \Mpdf\Mpdf(['tempDir' =>  sys_get_temp_dir().DIRECTORY_SEPARATOR.'mpdf', 'format' => 'A4' ]);
        $mpdf->AddPage('P','', '', '', '',
            '', // margin_left
            '', // margin right
            '', // margin top
            '', // margin bottom
            '', // margin header
            11.5); // margin footer
        $mpdf->SetHTMLFooter($footer);
        $mpdf->WriteHTML($html);

        if(isset($listPathUc2)) {
            $html = $this->renderView(':pdf:resume2.html.twig',
                array(
                    'listPathUc2' => [$listPathUc2],
                ));
            $mpdf->AddPage('P','', '', '', '',
                '', // margin_left
                '', // margin right
                '', // margin top
                '', // margin bottom
                '', // margin header
                11.5); // margin footer
            $mpdf->SetHTMLFooter($footer);
            $mpdf->WriteHTML($html);
        }

        if(isset($listPathUc3)) {//
            $html = $this->renderView(':pdf:resume2.html.twig',
                array(
                    'listPathUc2' => [$listPathUc3],
                ));
            $mpdf->AddPage('P','', '', '', '',
                '', // margin_left
                '', // margin right
                '', // margin top
                '', // margin bottom
                '', // margin header
                11.5); // margin footer
            $mpdf->SetHTMLFooter($footer);
            $mpdf->WriteHTML($html);
        }
        $response->setContent($mpdf->Output());
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Type', ' charset=utf-8');
        $response->headers->set('Content-disposition', 'filename=1.pdf');

        return $response;

    }
}
