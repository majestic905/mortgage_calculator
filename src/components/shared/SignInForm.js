import React, {useState, useCallback} from 'react';
import InputField from "./InputField";
import Button from "./Button";


const SignInForm = ({signIn}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const doSubmit = useCallback((ev) => {
        ev.preventDefault();
        setIsLoading(true);

        const data = new FormData(ev.target);
        const email = data.get('email');
        const password = data.get('password');

        signIn(email, password)
            .catch(error => {
                setIsLoading(false);
                setErrorMessage(`[${error.code}] ${error.message}`);
            });
    }, [signIn]);

    return (
        <form id="sign-in-form" onSubmit={doSubmit}>
            <InputField type="email" name="email" large label="Email" inputProps={{autoFocus: true, required: true}}/>
            <InputField type="password" name="password" large label="Пароль"/>
            <div className='form-group'>
                {errorMessage && <div className="toast toast-error mb-2">{errorMessage}</div>}
                <Button type="submit" large primary block loading={isLoading} content="Войти"/>
            </div>
        </form>
    )
}

export default SignInForm;