import {AuthButton} from "../components/buttons/auth-buttons.jsx";
import { useNavigate } from "react-router-dom";

export const RegisterView = () => {

    const navigate = useNavigate()

    return (
        <>
            <div className="authentication-window">
                <span id="page-title">Create Account</span>
                <div className="register-container">
                    <div className="register-inputs__wrapper">
                        <div className="register-login__container">
                            <span className="register-login__title">Login:</span>
                            <input
                                type="text"
                                placeholder="enter login..."
                                id="register-login__input"
                                autoComplete="off"
                            />
                        </div>
                        <div className="register-password__container">
                            <span className="register-password__title">Password:</span>
                            <input
                                type="password"
                                placeholder="enter password..."
                                id="register-password__input"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className="register-buttons__wrapper">
                        <AuthButton buttonText={"Back to login page"} id={"auth-page__button"} onClick={() => navigate("/auth")}/>
                        <AuthButton buttonText={"Register"} id={"register-button"}/>
                    </div>

                </div>
            </div>
        </>
    )
}


