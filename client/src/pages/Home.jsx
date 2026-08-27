import { useEffect, useState } from "react";
import { getHome } from "./api";
import { useDispatch, useSelector } from "react-redux";
import { removeDatass } from "../Redux/userSlice";


const Home = () => {


  const dispatch=useDispatch()

    let loginInfo=useSelector((state)=>state.loginInfo.loginData)
  console.log("logon info in app page",loginInfo);

let userId=loginInfo?.userId
  

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [user, setUser] = useState();
useEffect(() => {
  if (!userId) return;
  getHome(userId).then((data) => setUser(data));
}, [userId]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    console.log("Updated User:", user);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Account deleted");
    setShowDeleteModal(false);
  };

  function removeData(){
dispatch(removeDatass())
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {user?.name} Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Top Profile Section */}
          <div className="bg-slate-900 px-6 py-8 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                {/* Profile Image */}
                <img
                  src={user?.image}
                  alt={user?.name}
                  className="h-24 w-24 rounded-full border-4 border-white/20 object-cover"
                />

                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {user?.name}
                  </h2>

                  <p className="mt-1 text-slate-300">
                    {user?.email}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {user?.age} years · {user?.mobile}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-lg border border-red-400/40 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
                <button
                  onClick={removeData}
                  className="rounded-lg border border-red-400/40 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  Logout Account
                </button>

              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="px-6 py-8 sm:px-10">

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Personal Information
              </h3>

              <p className="text-sm text-slate-500">
                Your basic account information.
              </p>
            </div>

            {isEditing ? (

              /* Edit Form */
              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="Full Name"
                  name="name"
                  value={user?.name}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={user?.email}
                  onChange={handleChange}
                />

                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={user?.age}
                  onChange={handleChange}
                />

                <Input
                  label="Mobile"
                  name="mobile"
                  value={user?.mobile}
                  onChange={handleChange}
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={user?.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Please Select Image
                  </label>

                  <input
                    name="image"
                  type="file"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div className="flex gap-3 sm:col-span-2">

                  <button
                    onClick={handleUpdate}
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            ) : (

              /* Profile Information */
              <div className="grid gap-6 sm:grid-cols-2">

                <Info
                  label="Full Name"
                  value={user?.name}
                />

                <Info
                  label="Email"
                  value={user?.email}
                />

                <Info
                  label="Age"
                  value={`${user?.age} years`}
                />

                <Info
                  label="Mobile"
                  value={user?.mobile}
                />

                <div className="sm:col-span-2">
                  <Info
                    label="Address"
                    value={user?.address}
                  />
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Delete Account?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This action cannot be undone. All your profile information
                will be permanently deleted.
              </p>
            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Account
              </button>
      

            </div>

          </div>
        </div>
      )}
    </div>
  );
};


/* Reusable Input */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
    </div>
  );
};


/* Reusable Information Item */
const Info = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default Home;