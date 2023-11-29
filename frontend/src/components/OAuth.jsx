import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/slices/user-slice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Toast } from "../utils/toast";
import { customSwal } from "../utils/customSwal";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));

      Toast.fire({
        icon: "success",
        title: "You have successfully signed in!",
      });

      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
