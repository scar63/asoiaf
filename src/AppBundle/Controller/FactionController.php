<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Faction;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * Faction controller.
 *
 * @Route("faction")
 */
class FactionController extends Controller
{
    /**
     * Lists all faction entities.
     *
     * @Route("/", name="faction_index", methods={"GET"})
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $factions = $em->getRepository('AppBundle:Faction')->findAll();

        return $this->render('faction/index.html.twig', array(
            'factions' => $factions,
        ));
    }

    /**
     * Creates a new faction entity.
     *
     * @Route("/new", name="faction_new", methods={"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $faction = new Faction();
        $form = $this->createForm('AppBundle\Form\FactionType', $faction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $attachments = $faction->getImages();
            if ($attachments) {
                foreach($attachments as $attachment)
                {
                    $file = $attachment->getImage();

                    $file->move(
                        $this->getParameter('faction_directory'), $file->getClientOriginalName()
                    );
                    $attachment->setImage($file->getClientOriginalName());
                }
            }


            $em = $this->getDoctrine()->getManager();
            $em->persist($faction);
            $em->flush();

            return $this->redirectToRoute('faction_show', array('id' => $faction->getId()));
        }

        return $this->render('faction/new.html.twig', array(
            'faction' => $faction,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a faction entity.
     *
     * @Route("/{id}", name="faction_show", methods={"GET"})
     */
    public function showAction(Faction $faction)
    {
        $deleteForm = $this->createDeleteForm($faction);

        return $this->render('faction/show.html.twig', array(
            'faction' => $faction,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing faction entity.
     *
     * @Route("/{id}/edit", name="faction_edit", methods={"GET", "POST"})
     */
    public function editAction(Request $request, Faction $faction)
    {
        $deleteForm = $this->createDeleteForm($faction);
        $editForm = $this->createForm('AppBundle\Form\FactionType', $faction);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('faction_edit', array('id' => $faction->getId()));
        }

        return $this->render('faction/edit.html.twig', array(
            'faction' => $faction,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a faction entity.
     *
     * @Route("/{id}", name="faction_delete", methods={"DELETE"})
     */
    public function deleteAction(Request $request, Faction $faction)
    {
        $form = $this->createDeleteForm($faction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($faction);
            $em->flush();
        }

        return $this->redirectToRoute('faction_index');
    }

    /**
     * Creates a form to delete a faction entity.
     *
     * @param Faction $faction The faction entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Faction $faction)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('faction_delete', array('id' => $faction->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
