import { useDispatch } from "react-redux";
import { addToast } from "../slices/toastSlice";

const useToast = () => {
  const dispatch = useDispatch();

  const showToast = (message, type = "info", duration = 4000) => {
    dispatch(addToast({ message, type, duration }));
  };

  const toast = {
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
    info: (message, duration) => showToast(message, "info", duration),
  };

  return toast;
};

export default useToast;
