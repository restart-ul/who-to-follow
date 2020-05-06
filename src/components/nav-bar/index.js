import React from "react"
import { Link } from "gatsby"
import { useAuth0 } from "../../utils/auth"
import css from "./index.module.css"

export const Navigation = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    loading,
    checkUserForRole,
    availableRoles,
  } = useAuth0()

  const isSuperAdmin = checkUserForRole([availableRoles.INFLUENCER_SUPER_ADMIN])
  const isContributor = checkUserForRole([
    availableRoles.INFLUENCER_CONTRIBUTOR,
  ])
  return (
    <nav className={css.nav}>
      <Link className={css.navItem} to="/">
        Home
      </Link>
      {isAuthenticated && (
        <>
          {(isContributor || isSuperAdmin) && (
            <Link className={css.navItem} to="/addInfluencer">
              Add
            </Link>
          )}
          {isSuperAdmin && (
            <Link className={css.navItem} to="/admin">
              Admin
            </Link>
          )}

          <Link className={css.navItem} to="/account">
            My Account
          </Link>
          <button
            className={`${css.navItem} button`}
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
          >
            Log out
          </button>
        </>
      )}
      {!isAuthenticated && !loading && (
        <button
          className={`${css.navItem} button`}
          onClick={() =>
            loginWithRedirect({ appState: `${window.location.pathname}` })
          }
        >
          Log in
        </button>
      )}
    </nav>
  )
}
