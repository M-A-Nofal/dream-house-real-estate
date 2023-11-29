import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import {
  updateUserSuccess,
  deleteUserSuccess,
  signOutUserSuccess,
} from "../redux/slices/user-slice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { customSwal } from "../utils/customSwal";
import { Toast } from "../utils/toast";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/user/update/${currentUser.data.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.data === null) {
        setLoading(false);
        customSwal({
          icon: "error",
          title: "Error",
          text: `An error occurred: ${data.message}`,
        });
        return;
      }

      dispatch(updateUserSuccess(data));
      setLoading(false);
      Toast.fire({
        icon: "success",
        title: "Your information has been successfully updated!",
      });
    } catch (error) {
      setLoading(false);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  const handleDeleteUserConfirmation = () => {
    customSwal({
      title: "Delete Account",
      text: "Are you sure you want to delete your account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete my account!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser();
      } else if (result.isDismissed) {
        customSwal({
          icon: "info",
          title: "Cancelled",
          text: "The account deletion operation was cancelled.",
        });
      }
    });
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/delete/${currentUser.data.user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.data !== null) {
        setLoading(false);
        customSwal({
          icon: "error",
          title: "Error",
          text: `An error occurred: ${data.message}`,
        });
        return;
      }
      dispatch(deleteUserSuccess(data));
      setLoading(false);
      Toast.fire({
        icon: "success",
        title: "Your account has been successfully deleted!",
      });
    } catch (error) {
      setLoading(false);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  const handleSignOutConfirmation = () => {
    customSwal({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, sign me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSignOut();
      } else if (result.isDismissed) {
        customSwal({
          icon: "info",
          title: "Cancelled",
          text: "The sign out operation was cancelled.",
        });
      }
    });
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.data !== null) {
        setLoading(false);
        customSwal({
          icon: "error",
          title: "Error",
          text: `An error occurred: ${data.message}`,
        });
        return;
      }

      dispatch(signOutUserSuccess(data));
      setLoading(false);

      Toast.fire({
        icon: "success",
        title: "You have successfully signed out!",
      });
    } catch (error) {
      setLoading(false);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `/api/user/listings/${currentUser.data.user._id}`
      );

      const data = await res.json();
      if (data.data === null) {
        setShowListingsError(true);
        return;
      }
      if (data.data.listings.length < 1) {
        customSwal({
          icon: "info",
          title: "No Listings",
          text: "There are currently no listings available. You haven't added any listings yet.",
        });
        return;
      }
      setUserListings(data.data.listings);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDeleteConfirmation = (listingId) => {
    customSwal({
      title: "Delete Listing",
      text: "Are you sure you want to delete this listing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleListingDelete(listingId);
      } else if (result.isDismissed) {
        customSwal({
          icon: "info",
          title: "Cancelled",
          text: "The listing deletion operation was cancelled.",
        });
      }
    });
  };

  const handleListingDelete = async (listingId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.data !== null) {
        setLoading(false);
        customSwal({
          icon: "error",
          title: "Error",
          text: `An error occurred: ${data.message}`,
        });
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );

      setLoading(false);
      Toast.fire({
        icon: "success",
        title: "The listing has been successfully deleted!",
      });
    } catch (error) {
      setLoading(false);
      customSwal({
        icon: "error",
        title: "Error",
        text: `An error occurred: ${error.message}`,
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.data.user.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 4 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.data.user.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.data.user.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUserConfirmation}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOutConfirmation}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>

      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDeleteConfirmation(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
