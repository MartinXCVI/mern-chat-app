// React icons
import { IoLogOutOutline } from "react-icons/io5";
import useLogout from "../../hooks/useLogout";

const Logout = () => {

  const { loading, logout } = useLogout()

  const logoutButton = (
    <>
      <IoLogOutOutline
        className="w-6 h-6 text-white cursor-pointer"
        onClick={logout}
        title="Exit icon"
      />
    </>
  )

  const loadingSpinner = (
    <>
      <span className="loading loading-spinner"></span>
    </>
  )

  return (
    <div className="mt-auto">
      { !loading ? (logoutButton) : (loadingSpinner) }
    </div>
  )
}

export default Logout