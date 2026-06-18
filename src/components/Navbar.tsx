import { useNavigate, Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-sm font-semibold tracking-tight">Mon App</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <Link to="/users">Liste des utilisateurs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {isAuthenticated ? (
              <NavigationMenuItem>
                <Button variant="ghost" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Button variant="ghost" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
