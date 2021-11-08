import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';

const FormFieldWithError = ({ name, label, type = 'text' }) =>
  <div className="mb-4 text-gray-700">
    <label className="block mb-1" htmlFor="forms-validationInputCode_error">{label}</label>
    <Field id="name" name={name} type={type} className="w-full h-10 px-3 text-base placeholder-gray-600 border border-red-700 rounded-lg focus:shadow-outline" />
    <ErrorMessage name={name} component="div" className="bold text-red-500 text-xs error-message-input" />
  </div>

const FormAlert = ({ text }) =>
  <>
    {text ? <div name="form-alert" className="rounded p-1 bg-red-500 text-white" role="alert">{text}</div> : null}
  </>

const EditProfileForm = ({ username, email, telephone, profilePicture, handleSubmit }) => {

  const schema = yup.object().shape({
    telephone: yup.string().trim().required("El telefono no puede estar vacio"),
    name: yup.string().trim().required("El nombre de usuario no puede estar vacio"),
    email: yup.string().email("Debe ingresar un email válido").trim().required("El email no puede estar vacio"),
    image: yup.string().url("Debe ingresar una url válida").trim().required("La foto de perfil no puede estar vacia"),
  });

  const [submitError, setSubmitError] = useState(null)

  return (
    <Formik
      initialValues={{ name: username, email, telephone, image: profilePicture }}
      validationSchema={schema}
      onSubmit={
        async (values) => {
          handleSubmit(values).catch(error => {
            setSubmitError(error.response.data.error)
          })
        }
      }
    >
      <Form name="edit-profile-form" >
        <FormFieldWithError name="name" label="Nombre de Usuario" />
        <FormFieldWithError name="email" label="Email" />
        <FormFieldWithError name="telephone" label="Telefono" />
        <FormFieldWithError name="image" label="Foto de perfil" />

        <FormAlert text={submitError} />

        <button type="submit" className="mt-4 button-principal" >Actualizar</button>
      </Form>
    </Formik>
  );

}

export default EditProfileForm;