import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const FormAlert = ({text}) =>
  <>
    { text ? <div className="pizza-form-alert" role="alert">{ text }</div> : null }
  </>

const EditProductForm = ({product: { name, description, price, imageURL }, handleSubmit }) => {
  const [submitError, setSubmitError] = useState(null)
  
  return (
    <Formik
      initialValues = { { name, description, price, imageURL } }
      onSubmit = {
        async editedProduct =>
          handleSubmit(editedProduct).catch(error => setSubmitError(error.response.data.error))
      }
    >
      <Form className="edit-product-form">
        <Field id="name" name="name" placeholder="Nombre" className="input mb-8" />
        <Field id="description" name="description" placeholder="Descripcion" className="input mb-8" />
        <Field id="price" name="price" placeholder="Precio" className="input mb-8" type="number"/>
        <Field id="imageURL" name="imageURL" placeholder="URL de imagen" className="input mb-8" />

        <FormAlert text={submitError} />

        <button type="submit" className="mt-4 button-principal" >Actualizar</button>
      </Form>
    </Formik>
  )
}

export default EditProductForm