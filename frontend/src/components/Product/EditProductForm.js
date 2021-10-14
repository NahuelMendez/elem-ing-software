import { Formik, Field, Form } from 'formik';

const EditProductForm = ({product: { name, description, price, imageURL }, handleSubmit }) =>
  <Formik
    initialValues = { { name, description, price, imageURL } }
    onSubmit = { async editedProduct => handleSubmit(editedProduct) }
  >
    <Form className="edit-product-form">
      <Field id="name" name="name" placeholder="Nombre" className="input mb-8" />
      <Field id="description" name="description" placeholder="Descripcion" className="input mb-8" />
      <Field id="price" name="price" placeholder="Precio" className="input mb-8" type="number"/>
      <Field id="imageURL" name="imageURL" placeholder="URL de imagen" className="input mb-8" />

      <button type="submit" className="mt-4 button-principal" >Actualizar</button>
    </Form>

  </Formik>

//flex flex-col justify-center items-center mt-8
export default EditProductForm