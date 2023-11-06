import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({children}: {children:React.ReactNode}){

    // 현재 로그인 되어있는 user의 값 로그인 되어있지 않다면 null
    const user = auth.currentUser
    // 로그인 되어있지 않다면 /login 페이지로 이동
    if(user === null){
        return <Navigate to={"/login"} />
    }

    return children;
    // return <Home />
    // return <Profile /> 와 같다.
}