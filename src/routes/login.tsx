import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useLoginMutation } from '../hooks/useLogin'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: '/users' })
    }
  }, [isAuthenticated, router])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (success) => {
          if (success) {
            login()
          } else {
            toast.error('Email ou mot de passe incorrect.')
          }
        },
        onError: () => {
          toast.error('Erreur de connexion.')
        },
      },
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/50">
      <div className="flex w-full max-w-sm flex-col gap-6">

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Connexion</CardTitle>
              <CardDescription>
                Connectez-vous avec votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Mot de passe</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white cursor-pointer"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
