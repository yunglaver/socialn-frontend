import { useNavigate } from "react-router-dom";
import {AuthButton} from "../../components/Auth/buttons/AuthButton.jsx";
import styles from "./Auth.module.scss";
import {AuthInput} from "../../components/Auth/inputs/AuthInput.jsx";
import {authService} from "../../services/auth.services.js"
import {socket} from "../../core/socket.js";
import { useState, useRef } from "react";



export const AuthView = () => {


    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const passwordRef = useRef("");
    const navigate = useNavigate();

    if (localStorage.getItem("token") && socket) navigate("/m")


    const handleLogin = async (login, password) =>  {

        if (!login || !password) return;



        try {
            const result = await authService(login, password);
            if (result.error) {
                console.log(result.error);
                return;
            }

            navigate("/m")

        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    return (
            <>
                <div className={styles.background}>
                    <div className={styles.blur__filter}>
                        <div className={styles.wrapper}>
                            <span className={styles.title}>Sign In</span>
                            <div className={styles.auth__container}>
                                <div className={styles.inputs__wrapper}>
                                    <AuthInput
                                        type={"text"}
                                        placeholder={"Login"}
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                passwordRef.current.focus();
                                            }
                                        }}
                                    />
                                    <AuthInput
                                        type={"password"}
                                        placeholder={"Password"}
                                        ref={passwordRef}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            void handleLogin(login, password);
                                        }}}
                                    />
                                </div>
                                <div className={styles.buttons__wrapper}>
                                    <AuthButton
                                        buttonText={"Sign in"}
                                        id="auth-signin__button"
                                        onClick={handleLogin}
                                    />
                                    <AuthButton buttonText={"Register"} id={"register-page__button"} onClick={() => navigate("/register")}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };