export const AuthButton = ({buttonText, onClick, id} ) => {
    return (
        <button id={id} onClick={onClick}>{buttonText}</button>
    )

}