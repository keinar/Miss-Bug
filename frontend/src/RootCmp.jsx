import { AppHeader } from "./cmps/AppHeader.jsx"
import { AppFooter } from "./cmps/AppFooter.jsx"
import { Home } from "./pages/Home.jsx"
import { BugIndex } from "./pages/BugIndex.jsx"
import { BugDetails } from "./pages/BugDetails.jsx"
import { AboutUs } from "./pages/AboutUs.jsx"
import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom"
import { UserIndex } from "./pages/UserIndex.jsx"
import { Provider, useSelector } from "react-redux"
import { UserDetails } from "./pages/UserDetails.jsx"
import { store } from "./store/store.js"

function UserIndexRouteGuard({ children, authLevel }) {
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

  function isAdmin() {
    return loggedinUser?.isAdmin
  }

  if (!isAdmin()) {
    return <Navigate to="/" />
  }

  return children
}

function UserDetailsRouteGuard({ children }) {
  const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

  function isLoggedin() {
    return !!loggedinUser
  }

  if (!isLoggedin()) {
    return <Navigate to="/" />
  }

  return children
}

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <AppHeader />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bug" element={<BugIndex />} />
              <Route path="/bug/:bugId" element={<BugDetails />} />
              <Route
                path="/user"
                element={
                  <UserIndexRouteGuard>
                    <UserIndex />
                  </UserIndexRouteGuard>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <UserDetailsRouteGuard>
                    <UserDetails />
                  </UserDetailsRouteGuard>
                }
              />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
          </main>
          <AppFooter />
        </div>
      </Router>
    </Provider>
  )
}
