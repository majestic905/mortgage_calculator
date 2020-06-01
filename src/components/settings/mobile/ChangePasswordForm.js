import React from 'react';
import InputField from "../../shared/InputField";
import usePasswordChange from "../usePasswordChange";
import Button from "../../shared/Button";


const ChangePasswordForm = ({changePassword, onSuccess}) => {
    const {isLoading, errorMessage, doSubmit} = usePasswordChange(changePassword, onSuccess)

    return (
        <form id="change-password-form" onSubmit={doSubmit}>
            <InputField type="password" name="password" label="Текущий пароль" inputProps={{autoFocus: true, required: true}} />
            <InputField type="password" name="newPassword" label="Новый пароль" inputProps={{required: true}} />
            <div className='form-group mt-3'>
                {errorMessage && <div className="toast toast-error mb-2">{errorMessage}</div>}
                <Button type="submit" primary large block loading={isLoading} content="Отправить" />
            </div>
        </form>
    )
}

export default ChangePasswordForm;