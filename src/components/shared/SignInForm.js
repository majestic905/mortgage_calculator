import React, {useState, useCallback} from 'react';
import cx from "classnames";
import './SignInForm.scss'

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
            <div className='form-group'>
                <label htmlFor='email' className='form-label label-lg'>Email</label>
                <input type='email' className='form-input input-lg' name='email' id='email' autoFocus/>
            </div>
            <div className='form-group'>
                <label htmlFor='password' className='form-label label-lg'>Пароль</label>
                <input type='password' className='form-input input-lg' name='password' id='password'/>
            </div>
            <div className='form-group'>
                {errorMessage && <div className="toast toast-error mb-2">{errorMessage}</div>}
                <button type="submit" className={cx("btn btn-lg btn-primary btn-block", {loading: isLoading})}>Войти</button>
            </div>
        </form>
    )
}

export default SignInForm;