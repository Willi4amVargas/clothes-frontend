import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { SendMailForm } from './-components/SendMailForm'
import { ChangePasswordForm } from './-components/ChangePasswordForm'

interface AuthQueryParams {
  code?: string
}

export const Route = createFileRoute('/_auth/recovery-password/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): AuthQueryParams => {
    return {
      code: search.code as string
    }
  },
  head: () => ({
    meta: [
      {
        title: `${import.meta.env.VITE_COMPANY_NAME} | Recovery Password`
      }
    ]
  })
})

function RouteComponent() {
  const { code } = Route.useSearch()
  return <Card className="w-full max-w-md shadow-lg">
    <CardHeader className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        Corporate Precision
      </p>
      <CardTitle className="text-2xl">Recovery Password</CardTitle>
      <CardDescription>
        Enter your credentials to recovery password
      </CardDescription>
    </CardHeader>

    <CardContent>
      {code ? <ChangePasswordForm code={code} /> : <SendMailForm />}
      <Button variant={"link"} asChild className="mt-5">
        <Link to={"/login"}>Iniciar Sesión</Link>
      </Button>
    </CardContent>
  </Card>
}
