import { useContext, useEffect, useState } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
    const navigate = useNavigate();

    const { loginContext } = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loadingAPI, setLoadingAPI] = useState(false)

    // useEffect(() => {
    //     let token = localStorage.getItem("token");
    //     if(token) {
    //         navigate("/")
    //     }
    // }, [])
    
    const handleLogin = async () => {
        if (!email || !password) toast.error("Please enter email or password")
        setLoadingAPI(true);
        let res = await loginApi(email.trim(), password)
        if(res && res.token) {
            loginContext(email, res.token)
            navigate("/")
        } else {
            if(res && res.status === 400) {
                toast.error(res.data.error)
            }
        }
        setLoadingAPI(false);
    }

    const handleGoBack = () => {
        navigate("/");
    }

    const handlePressEnter = (event) => {
        if(event && event.key === "Enter") {
            handleLogin();
        }
    }
    return (
        <>
        <div className="login-container col-12 col-sm-4">
            <div className="title">Login</div>
            <div className="text">Email or username</div>
            <input
                type="text"
                placeholder="Email or username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <div className="input-2">
                <input 
                    type={showPassword === true ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={(event) => handlePressEnter(event)}
                />
                <i className={showPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash" }
                onClick={() => setShowPassword(!showPassword)}></i>
            </div>

            <button
                className={email && password ? "active" : ""}
                disabled={email && password ? false : true}
                onClick={() => handleLogin()}
            >
                {loadingAPI && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Login
            </button>
            <div className="back">
            <i className="fa-solid fa-backward"></i> 
            <span onClick={() => handleGoBack()}>Go back</span>
            </div>
        </div>
        </>
    )
}

export default Login;