import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const FormFieldWithError = ({name, label, type='text'}) =>
  <div className="mb-4 text-gray-700">
    <label className="block mb-1" htmlFor="forms-validationInputCode_error">{label}</label>
    <Field id="name" name={name} type={type} className="w-full h-10 px-3 text-base placeholder-gray-600 border border-red-700 rounded-lg focus:shadow-outline" />
    <ErrorMessage name={name} render={message => <div name="input-error-message" class="bold text-red-500">{message}</div>}/>
  </div>

const FormAlert = ({text}) =>
  <>
    { text ? <div name="form-alert" className="rounded p-1 bg-red-500 text-white" role="alert">{ text }</div> : null }
  </>

const EditProfileForm = ({ username, email, telephone, handleSubmit }) => {

    const [submitError, setSubmitError] = useState(null)

    return (
        <Formik
            initialValues = { { username, email, telephone } }
            onSubmit = {
              async (values, { setErrors }) => {
                const errors = {}

                if (values.username.trim() === '') errors.username = 'El nombre de usuario no puede estar vacio'
                if (values.email.trim() === '') errors.email = 'El email no puede estar vacio'
                if (values.telephone.trim() === '') errors.telephone = 'El telefono no puede estar vacio'
                

                if (Object.keys(errors).length > 0) {
                    setErrors(errors)
                }
                else {
                    handleSubmit(values).catch(error => setSubmitError(error.response.data.error))
                }            
              }
            }
            >
            <Form name="edit-profile-form" >
                <FormFieldWithError name="username" label="Nombre de Usuario" />
                <FormFieldWithError name="email" label="Email" />
                <FormFieldWithError name="telephone" label="Telefono" type="text"/>

                <FormAlert text={submitError} />

                <button type="submit" className="mt-4 button-principal" >Actualizar</button>
            </Form>
        </Formik>
    );

}

export default EditProfileForm;