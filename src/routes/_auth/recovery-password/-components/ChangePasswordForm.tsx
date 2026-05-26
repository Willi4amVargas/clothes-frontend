import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useAuth } from "#/hook/useAuth";

export const ChangePasswordForm = ({ code }: { code: string }) => {
    const { changeUserPassword } = useAuth()

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.target)
        const code = form.get("code") as string
        const recovery_code = form.get("recovery_code") as string
        const new_password = form.get("new_password") as string
        if (code || recovery_code || new_password) {
            await changeUserPassword.mutate({
                code,
                recovery_code,
                new_password
            })
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            id="change-password-form"
            className="space-y-6"
        >
            <input id="code" name="code" type="hidden" value={code} />
            <Label htmlFor="recovery_code">Codigo de Recuperacion</Label>
            <Input id="recovery_code" name="recovery_code" type="text" placeholder="Ingresa el código recibido" autoComplete="off" />
            <Label htmlFor="new_password">Nueva Contraseña</Label>
            <Input id="new_password" name="new_password" type="password" placeholder="••••••••" autoComplete="new-password" />
            <Button
                type="submit"
                form="change-password-form"
                className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
                disabled={changeUserPassword.isPending}
            >
                Cambiar Contraseña
            </Button>
        </form>
    );
};