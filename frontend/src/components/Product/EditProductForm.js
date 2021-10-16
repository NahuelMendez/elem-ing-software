import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const FormFieldWithError = ({name, label, type='text'}) =>
  <div class="mb-4 text-gray-700">
    <label class="block mb-1" for="forms-validationInputCode_error">{label}</label>
    <Field id="name" name={name} type={type} className="w-full h-10 px-3 text-base placeholder-gray-600 border border-red-700 rounded-lg focus:shadow-outline" />
    <ErrorMessage name={name} render={message => <div name="input-error-message" class="bold text-red-500">{message}</div>}/>
  </div>

const FormAlert = ({text}) =>
  <>
    { text ? <div name="form-alert" className="rounded p-1 bg-red-500 text-white" role="alert">{ text }</div> : null }
  </>

const EditProductForm = ({product: { name, description, price, imageURL }, handleSubmit }) => {
  const [submitError, setSubmitError] = useState(null)
  
  return (
    <Formik
      initialValues = { { name, description, price, imageURL } }
      onSubmit = {
        async (values, { setErrors }) => {
          const errors = {}

          if (values.name.trim() === '') errors.name = 'El nombre no puede estar vacio'
          if (values.description.trim() === '') errors.description = 'La descripcion no puede estar vacia'
          if (values.price.trim() === '') errors.price = 'El precio no puede estar vacio'
          if (values.imageURL.trim() === '') errors.imageURL = 'La URL de la imagen no puede estar vacia'
          

          if (Object.keys(errors).length > 0) {
            setErrors(errors)
          }
          else {
            handleSubmit(values).catch(error => setSubmitError(error.response.data.error))
          }            
        }
      }
    >
      <Form name="edit-product-form" >
        <FormFieldWithError name="name" label="Nombre" />
        <FormFieldWithError name="description" label="Descripcion" />
        <FormFieldWithError name="price" label="Precio" type="text"/>
        <FormFieldWithError name="imageURL" label="URL de imagen" />

        <FormAlert text={submitError} />

        <button type="submit" className="mt-4 button-principal" >Actualizar</button>
      </Form>
    </Formik>
  )
}

export default EditProductForm