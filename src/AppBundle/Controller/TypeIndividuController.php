<?php

namespace AppBundle\Controller;

use AppBundle\Entity\TypeIndividu;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;use Symfony\Component\HttpFoundation\Request;

/**
 * Typeindividu controller.
 *
 * @Route("typeindividu")
 */
class TypeIndividuController extends Controller
{
    /**
     * Lists all typeIndividu entities.
     *
     * @Route("/", name="typeindividu_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $typeIndividus = $em->getRepository('AppBundle:TypeIndividu')->findAll();

        return $this->render('typeindividu/index.html.twig', array(
            'typeIndividus' => $typeIndividus,
        ));
    }

    /**
     * Creates a new typeIndividu entity.
     *
     * @Route("/new", name="typeindividu_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $typeIndividu = new Typeindividu();
        $form = $this->createForm('AppBundle\Form\TypeIndividuType', $typeIndividu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($typeIndividu);
            $em->flush();

            return $this->redirectToRoute('typeindividu_show', array('id' => $typeIndividu->getId()));
        }

        return $this->render('typeindividu/new.html.twig', array(
            'typeIndividu' => $typeIndividu,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a typeIndividu entity.
     *
     * @Route("/{id}", name="typeindividu_show")
     * @Method("GET")
     */
    public function showAction(TypeIndividu $typeIndividu)
    {
        $deleteForm = $this->createDeleteForm($typeIndividu);

        return $this->render('typeindividu/show.html.twig', array(
            'typeIndividu' => $typeIndividu,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing typeIndividu entity.
     *
     * @Route("/{id}/edit", name="typeindividu_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, TypeIndividu $typeIndividu)
    {
        $deleteForm = $this->createDeleteForm($typeIndividu);
        $editForm = $this->createForm('AppBundle\Form\TypeIndividuType', $typeIndividu);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('typeindividu_edit', array('id' => $typeIndividu->getId()));
        }

        return $this->render('typeindividu/edit.html.twig', array(
            'typeIndividu' => $typeIndividu,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a typeIndividu entity.
     *
     * @Route("/{id}", name="typeindividu_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, TypeIndividu $typeIndividu)
    {
        $form = $this->createDeleteForm($typeIndividu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($typeIndividu);
            $em->flush();
        }

        return $this->redirectToRoute('typeindividu_index');
    }

    /**
     * Creates a form to delete a typeIndividu entity.
     *
     * @param TypeIndividu $typeIndividu The typeIndividu entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(TypeIndividu $typeIndividu)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('typeindividu_delete', array('id' => $typeIndividu->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
