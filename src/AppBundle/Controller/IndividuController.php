<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Individu;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Individu controller.
 *
 * @Route("individu")
 */
class IndividuController extends Controller
{
    /**
     * Lists all individu entities.
     *
     * @Route("/", name="individu_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $individus = $em->getRepository('AppBundle:Individu')->findAll();

        return $this->render('individu/index.html.twig', array(
            'individus' => $individus,
        ));
    }

    /**
     * Creates a new individu entity.
     *
     * @Route("/new", name="individu_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $individu = new Individu();
        $form = $this->createForm('AppBundle\Form\IndividuType', $individu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($individu);
            $em->flush();

            return $this->redirectToRoute('individu_show', array('id' => $individu->getId()));
        }

        return $this->render('individu/new.html.twig', array(
            'individu' => $individu,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a individu entity.
     *
     * @Route("/{id}", name="individu_show")
     * @Method("GET")
     */
    public function showAction(Individu $individu)
    {
        $deleteForm = $this->createDeleteForm($individu);

        return $this->render('individu/show.html.twig', array(
            'individu' => $individu,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing individu entity.
     *
     * @Route("/{id}/edit", name="individu_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Individu $individu)
    {
        $deleteForm = $this->createDeleteForm($individu);
        $editForm = $this->createForm('AppBundle\Form\IndividuType', $individu);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('individu_edit', array('id' => $individu->getId()));
        }

        return $this->render('individu/edit.html.twig', array(
            'individu' => $individu,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a individu entity.
     *
     * @Route("/{id}", name="individu_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Individu $individu)
    {
        $form = $this->createDeleteForm($individu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($individu);
            $em->flush();
        }

        return $this->redirectToRoute('individu_index');
    }

    /**
     * Creates a form to delete a individu entity.
     *
     * @param Individu $individu The individu entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Individu $individu)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('individu_delete', array('id' => $individu->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
