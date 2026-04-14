import { useNavigate } from "react-router-dom";
import {AuthButton} from "../../components/Auth/buttons/AuthButton.jsx";
import styles from "./Auth.module.scss";
import {AuthInput} from "../../components/Auth/inputs/AuthInput.jsx";
import {useRef, useState} from "react";
import {registerService} from "../../services/auth.services.js";

export const RegisterView = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const passwordRef = useRef("");
    const navigate = useNavigate();

    const handleRegister = async (login, password) =>  {

        if (!login || !password) return;

        try {
            const result = await registerService(login, password);
            if (result.error) {
                console.log(result.error);
                return;
            }

            navigate("/")

        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };



    return (
        <>
            <div className={styles.background}>
                <div className={styles.blur__filter}>
                    <div className={styles.wrapper}>
                        <span className={styles.title}>Create account</span>

                        <div className={styles.auth__container}>
                            <div className={styles.inputs__wrapper}>
                                <AuthInput
                                    type={"text"}
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder={"Login"}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            passwordRef.current.focus();
                                        }
                                    }}
                                />
                                <AuthInput
                                    type={"password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    ref={passwordRef}
                                    placeholder={"Password"}
                                    onKeyDown={(e) =>  {
                                        if (e.key === "Enter") {
                                            void handleRegister(login, password)
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.buttons__wrapper}>
                                <AuthButton
                                    buttonText={"Create"}
                                    onClick={() => handleRegister(login, password)}
                                    id="auth-signin__button"
                                />
                                <AuthButton
                                    buttonText={"Back to login page"}
                                    id={"register-page__button"}
                                    onClick={() => navigate("/auth")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}



