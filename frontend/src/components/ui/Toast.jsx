import "./css/Toast.css";

export default function Toast({ type, message }) {
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
