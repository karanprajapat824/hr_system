import { forwardRef } from "react";
import "./css/Button.css";
import Loader from "./Loader";

const Button = forwardRef(function Button(
    {
        children,
        variant = "primary",
        size = "md",
        className = "",
        onClick,
        onKeyDown,
        disabled = false,
        loading = false,
        ...props
    },
    ref
) {
    return (
        <button
            disabled={disabled}
            ref={ref}
            onClick={onClick}
            onKeyDown={onKeyDown}
            className={`button button-${variant} button-${size} ${className}`}
            {...props}
        >
            {
                loading ?
                    <Loader />
                    : children
            }

        </button>
    );
});

export default Button;
