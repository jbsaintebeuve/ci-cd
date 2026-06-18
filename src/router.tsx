import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { Toaster } from 'sonner'
import RegistrationForm from './components/RegistrationForm'
import LoginPage from './routes/login'
import UsersPage from './routes/users'

/** Contexte d'authentification partagé via le routeur TanStack */
export interface AuthContext {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

import Navbar from './components/Navbar'

const rootRoute = createRootRouteWithContext<AuthContext>()({
  component: () => (
    <>
      <Navbar />
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RegistrationForm,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
})

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, usersRoute])

export const router = createRouter({
  routeTree,
  basepath: '/ci-cd',
  context: { isAuthenticated: undefined!, login: undefined!, logout: undefined! },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
