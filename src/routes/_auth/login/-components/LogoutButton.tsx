import { Button } from '../../../../components/ui/button'

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <Button className="w-auto" onClick={handleLogout}>
      {children}
    </Button>
  )
}
