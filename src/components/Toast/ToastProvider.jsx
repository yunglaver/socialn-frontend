import ToastContext from "./ToastService.js"
import {useState} from "react"
export default function ToastProvider({children}){
    const [toasts, setToasts] = useState([])
    return (
        <ToastContext.Provider>
            {children}
            <div>
                {toasts.map(({id, component}))}
            </div>
        </ToastContext.Provider>
    )
}