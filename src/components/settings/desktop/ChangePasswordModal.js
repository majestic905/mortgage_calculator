import React, {useState, useCallback, useEffect} from 'react';
import InputField from "../../shared/InputField";
import usePasswordChange from "../usePasswordChange";
import cx from "classnames";
import Button from "../../shared/Button";

const ChangePasswordModal = ({changePassword, provideOpen}) => {
    const [isActive, setIsActive] = useState(false);
    const doToggle = useCallback(() => setIsActive(active => !active), []);
    useEffect(() => provideOpen(() => doToggle), [provideOpen, doToggle]);

    const {isLoading, errorMessage, doSubmit} = usePasswordChange(changePassword)

    return (
        <div className={cx("modal", {"active": isActive})}>
            <span className="modal-overlay" onClick={doToggle}/>
            <div className="modal-container">
                <div className="modal-header">
                    <span className="btn btn-clear float-right" onClick={doToggle}/>
                    <div className="modal-title h5">Изменение пароля</div>
                </div>
                <form onSubmit={doSubmit}>
                    <div className="modal-body">
                        <InputField name="password" label="Текущий пароль" inputProps={{autoFocus: true, required: true}} />
                        <InputField name="newPassword" label="Новый пароль" inputProps={{required: true}} />
                    </div>
                    <div className="modal-footer">
                        {errorMessage && <div className="toast toast-error text-left mb-2">{errorMessage}</div>}
                        <Button type="submit" primary loading={isLoading} content="Отправить" />
                        <Button onClick={doToggle} className="ml-2" link content="Закрыть" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePasswordModal;