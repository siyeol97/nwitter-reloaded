import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./routes/Home"
import Profile from "./routes/Profile"
import Login from "./routes/Login"
import CreateAccount from "./routes/Create-account"
import styled, { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/Loading-screen"
import { auth } from "./firebase"
import ProtectedRoute from "./components/protected-route"

// 라우터
const router = createBrowserRouter([
  {
    path: "/",
    element: // Layout component가 Home, Profile을 감싸고 있기 때문에 Layout을 보호하면 Home, Profile도 보호한다.
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(()=>{
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {
        isLoading ? <LoadingScreen /> : <RouterProvider router={router} />
      }
    </Wrapper>
  )
}

export default App
