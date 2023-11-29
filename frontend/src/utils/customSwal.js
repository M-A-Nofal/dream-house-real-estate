import Swal from "sweetalert2";

export const customSwal = ({
  title,
  text,
  icon,
  confirmButtonText,
  showCancelButton,
  cancelButtonText,
}) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: showCancelButton || false,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: confirmButtonText || "OK",
    cancelButtonText: cancelButtonText || "Cancel",
  });
};
