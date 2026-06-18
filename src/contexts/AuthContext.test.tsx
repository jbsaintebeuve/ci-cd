import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

afterEach(() => {
  cleanup()
})

function Consumer() {
  const ctx = useAuth()
  return (
    <div>
      <span data-testid="authenticated">
        {ctx.isAuthenticated ? 'oui' : 'non'}
      </span>
    </div>
  )
}

describe('AuthContext', () => {
  it('fournit les valeurs au contexte', () => {
    const login = vi.fn()
    const logout = vi.fn()

    render(
      <AuthProvider isAuthenticated={true} login={login} logout={logout}>
        <Consumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('authenticated')).toHaveTextContent('oui')
  })

  it('reflète isAuthenticated à false', () => {
    render(
      <AuthProvider isAuthenticated={false} login={vi.fn()} logout={vi.fn()}>
        <Consumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('authenticated')).toHaveTextContent('non')
  })

  it('appelle login et logout via le hook', () => {
    const login = vi.fn()
    const logout = vi.fn()

    function ActionConsumer() {
      const ctx = useAuth()
      return (
        <div>
          <button onClick={ctx.login}>Login</button>
          <button onClick={ctx.logout}>Logout</button>
        </div>
      )
    }

    render(
      <AuthProvider isAuthenticated={false} login={login} logout={logout}>
        <ActionConsumer />
      </AuthProvider>,
    )

    screen.getByText('Login').click()
    expect(login).toHaveBeenCalledTimes(1)

    screen.getByText('Logout').click()
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it("lance une erreur si useAuth est utilisé hors d'un AuthProvider", () => {
    expect(() => render(<Consumer />)).toThrow(
      'useAuth must be used within an AuthProvider',
    )
  })

  it('mémoïse la valeur du contexte', () => {
    const login = vi.fn()
    const logout = vi.fn()
    let renderCount = 0

    function CountingConsumer() {
      renderCount++
      const ctx = useAuth()
      return <span data-testid="auth">{ctx.isAuthenticated ? 'oui' : 'non'}</span>
    }

    const { rerender } = render(
      <AuthProvider isAuthenticated={false} login={login} logout={logout}>
        <CountingConsumer />
      </AuthProvider>,
    )

    const firstRender = renderCount

    rerender(
      <AuthProvider isAuthenticated={false} login={login} logout={logout}>
        <CountingConsumer />
      </AuthProvider>,
    )

    expect(renderCount).toBeGreaterThan(firstRender)
    expect(screen.getByTestId('auth')).toHaveTextContent('non')
  })
})
