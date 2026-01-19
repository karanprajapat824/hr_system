import { createContext, useContext, useState, useCallback } from "react";
import Toast from "./../components/ui/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback(
        ({ type = "info", message = "", duration = 3000 }) => {
            setToast({ type, message });

            setTimeout(() => {
                setToast(null);
            }, duration);
        },
        []
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast type={toast.type} message={toast.message} />}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return ctx;
};
