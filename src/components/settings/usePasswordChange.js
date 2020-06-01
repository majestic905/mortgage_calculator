import {useState, useCallback} from "react";

const usePasswordChange = (changePassword, onSuccess) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const doSubmit = useCallback((ev) => {
        ev.preventDefault();
        setIsLoading(true);

        const data = new FormData(ev.target);
        const password = data.get('password');
        const newPassword = data.get('newPassword');

        changePassword(password, newPassword)
            .then(() => {
                if (onSuccess)
                    onSuccess();
            })
            .catch(error => {
                setIsLoading(false);
                setErrorMessage(`[${error.code}] ${error.message}`);
            });
    }, [changePassword, onSuccess]);

    return {isLoading, errorMessage, doSubmit};
}

export default usePasswordChange;