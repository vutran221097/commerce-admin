import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import fontawesome from "@fortawesome/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCreditCard,
    faRightFromBracket,
    faBorderAll,
    faMobileScreen,
    faComment
} from "@fortawesome/free-solid-svg-icons";

import './Sidebar.css'
import { logOut } from "../../reducer/authReducer";
import { useEffect, useState } from "react";

// add icon to library to use icon by "string"
fontawesome.library.add(faUser, faCreditCard, faRightFromBracket, faBorderAll, faMobileScreen, faComment);


const SideBarDataAdmin = [{
    title: "MAIN",
    data: [{ name: "Dashboard", path: "/dashboard", icon: "border-all" }]
}, {
    title: "LISTS",
    data: [
        { name: "Users", path: "/list/users", icon: "user" },
        { name: "Products", path: "/list/products", icon: "mobile-screen" },
        {
            name: "Orders",
            path: "/list/orders",
            icon: "credit-card"
        },
        {
            name: "Chat",
            path: "/chat",
            icon: "comment"
        }
    ]
}, {
    title: "NEW",
    data: [
        { name: "New Product", path: "/create/product", icon: "mobile-screen" },
    ]
}, {
    title: "USER",
    data: [{ name: "Logout", path: "/", icon: "right-from-bracket" }]
}]

const SideBarData = [{
    title: "LISTS",
    data: [
        {
            name: "Chat",
            path: "/chat",
            icon: "comment"
        }
    ]
}, {
    title: "USER",
    data: [{ name: "Logout", path: "/", icon: "right-from-bracket" }]
}]




const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [sideBar, setSideBar] = useState()
    const role = useSelector(state => state.auth.currentUser.role)

    useEffect(() => {
        role === 'admin' ? setSideBar(SideBarDataAdmin) : setSideBar(SideBarData)
        // eslint-disable-next-line 
    }, [])

    return (
        <div className="side-bar">
            {sideBar && sideBar.map((item, index) => {
                return (
                    <div className="mb-3" key={index}>
                        <h6>{item.title}</h6>
                        <div className="side-bar-item d-flex flex-column gap-2">
                            {item.data.map((v, i) => {
                                return (
                                    <div key={i} onClick={() => {
                                        if (v.name === "Logout") {
                                            dispatch(logOut())
                                        }
                                        navigate(v.path)
                                    }}>
                                        <FontAwesomeIcon className="side-bar-icon" icon={v.icon} /> &nbsp; {v.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )

}

export default Sidebar