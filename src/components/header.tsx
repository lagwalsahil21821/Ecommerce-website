import {useState} from 'react';
import { Link } from 'react-router-dom';
import {FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa';

const user = {_id: "kjk", role: "Admin"};
const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = () => {
        setIsOpen(false)
    }
  return (
    <nav className='header'>
        <Link to = {"/"} onClick = {() => setIsOpen(false)}>Home</Link>
        <Link to = "/search" onClick = {() => setIsOpen(false)}>
            <FaSearch />
        </Link>
        <Link to = "/cart" onClick = {() => setIsOpen(false)}>
            <FaShoppingBag />
        </Link>

        {(user?._id) ? 
            <div>
                <button onClick = {() => setIsOpen(prev => !prev)}>
                    <FaUser />
                </button>
                {/** dialog open on the basis of user if user is admin then admin settings otherwise user settings */}
                <dialog open = {isOpen}>
                    <div>
                        {user.role === "Admin" && (
                            <Link to = "/admin/dashboard" onClick = {() => setIsOpen(false)}> Admin </Link>
                        )}

                        <Link to = "/orders" onClick = {() => setIsOpen(false)}> Orders </Link>
                        <button onClick = {logoutHandler}>
                            <FaSignOutAlt />
                        </button>
                    </div>
                </dialog>
            </div> : 
            <Link to = "/login">
                <FaSignInAlt />
            </Link>
        }
    </nav>
  )
}

export default Header