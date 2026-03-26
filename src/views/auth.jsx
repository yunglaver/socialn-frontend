import { useNavigate } from "react-router-dom";
import {AuthButton} from "../components/buttons/auth-buttons.jsx";


export const AuthView = () => {


    const navigate = useNavigate();

    return (
        <>
            <div className="authentication-window">
                <span id="page-title">Sign In</span>

                <div className="auth-container">
                    <div className="auth-inputs__wrapper">
                        <div className="auth-login__container">
                            <span className="auth-login__title">Login:</span>
                            <input
                                type="text"
                                placeholder="enter login..."
                                id="auth-login__input"
                                autoComplete="off"
                            />
                        </div>

                        <div className="auth-password__container">
                            <span className="auth-password__title">Password:</span>
                            <input
                                type="password"
                                placeholder="enter password..."
                                id="auth-password__input"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="auth-buttons__wrapper">
                        <AuthButton buttonText={"Sign in"} id="auth-signin__button"/>
                        <AuthButton buttonText={"Register"} id={"register-page__button"} onClick={() => navigate("/register")}/>
                    </div>

                </div>
            </div>
        </>
    )
}

