import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice"
export default function Profile() {
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const [image, setImage] = useState(undefined)
  const [imagePercent, setImagePercent] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const {currentUser, loading, error} = useSelector(state => state.user)
  useEffect(() => {
    if (image) {
      handleFileUpload(image)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image])
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on( 
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true)
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setFormData({...formData, profilePicture: downloadURL})
        });
        console.log("Upload complete");
      }
    );
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  } 
  console.log(formData)
  // console.log('currentUser:', currentUser);
  // console.log('currentUser.user:', currentUser.user);


  const userId = currentUser?.user?._id;
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      
      const res = await fetch (`/api/user/update/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false) {
        dispatch(updateUserFailure(data))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Profile</h1>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          type="file" 
          ref={fileRef} 
          hidden
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])}
        />
        
        <img src={currentUser?.profilePicture || currentUser?.user?.profilePicture||formData?.profilePicture} 
        alt="profile" className="h-24 w-24 self-center 
        cursor-pointer rounded-full object-cover mt-2"
        onClick={() => fileRef.current.click()}/>
        
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : imagePercent > 0 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
          ) : null}
        </p>
        <input 
          defaultValue={currentUser?.user?.username} 
          type="text" 
          id="username" 
          placeholder="Username" 
          className="bg-slate-100 rounded-lg p-3" 
          onChange={handleChange}
        />
        <input 
          defaultValue={currentUser?.user?.email} 
          type="email" 
          id="email" 
          placeholder="Email" 
          className="bg-slate-100 rounded-lg p-3" 
          onChange={handleChange}
        />
        <input 
          type="password" 
          id="password" 
          placeholder="Password" 
          className="bg-slate-100 rounded-lg p-3" 
          onChange={handleChange}
        />
        <button 
        className="bg-slate-700
         text-white p-3 
         rounded-lg uppercase
          hover:opacity-95 disabled:opacity-80">{loading? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">{updateSuccess && "User is updated successfully!"}</p>
    </div>
  )
}
