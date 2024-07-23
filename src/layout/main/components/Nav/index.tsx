import { NavLink } from 'react-router-dom'

import { getMyId } from '~/data/local-storage'

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? '' : 'underline'

export default function Nav() {
  const myId = getMyId()
  return (
    <nav className="fixed top-4 z-50 flex w-full justify-center">
      <div className="container mx-auto mb-8 px-4">
        <div className="flex justify-between rounded-full bg-amber-300 px-8 py-4">
          <NavLink to="/" className="flex items-baseline font-bold">
            <img
              src="/logo-square.png"
              alt="ZSSN logo"
              className="w-4"
            />{' '}
            ZSSN
          </NavLink>
          <div className="flex gap-x-4">
            <NavLink to="/sign-up" className={getNavLinkClassName}>
              Sign up
            </NavLink>
            {myId ? (
              <NavLink
                to={`/profile/${myId}`}
                className={getNavLinkClassName}
              >
                My profile
              </NavLink>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
