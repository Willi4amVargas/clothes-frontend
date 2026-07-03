import { useAuth } from '#/hook/useAuth'
import { Link } from '@tanstack/react-router'
import { Button } from '../../../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card'
import { Input } from '../../../../components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useState } from 'react'

export function LoginForm() {
  const { login } = useAuth()
  const [visiblePassword, setVisiblePassword] = useState(false)

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const data = {
      code: form.get('code') as string,
      password: form.get('password') as string,
    }
    login.mutate(data)
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Corporate Precision
        </p>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access the system.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} id="login-form" className="space-y-6">
          <Input name="code" id="code" type="text" placeholder="e.g. USR001" />
          <InputGroup>
            <InputGroupInput
              name="password"
              id="password"
              type={visiblePassword ? 'text' : 'password'}
              placeholder={visiblePassword ? 'secretpassword' : '••••••••'}
            />
            <InputGroupAddon align={'inline-end'} className='hover:cursor-pointer'>
              {visiblePassword ? (
                <EyeSlashIcon onClick={() => setVisiblePassword(false)} />
              ) : (
                <EyeIcon onClick={() => setVisiblePassword(true)} />
              )}
            </InputGroupAddon>
          </InputGroup>
          {/* <Input /> */}
          <Button
            type="submit"
            form="login-form"
            className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
            disabled={login.isPending}
          >
            Iniciar Sesión
          </Button>
        </form>
        <Button variant={'link'}>
          <Link to="/recovery-password">¿Olvidaste la contraseña?</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
