import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { useAuth } from "#/hook/useAuth";

export const SendMailForm = () => {

    const { sendRecoveryMail } = useAuth()

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.target)
        const code = form.get("code") as string
        if (code) {
            await sendRecoveryMail.mutate({ code })
        }
    }


    return (
        <form
            onSubmit={onSubmit}
            id="recovery-form"
            className="space-y-6"
        >
            <Label htmlFor="code">User Code</Label>
            <Input name="code" id="code" type="text" placeholder="e.g. USR001" autoComplete="off" />
            <Button
                type="submit"
                form="recovery-form"
                className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
                disabled={sendRecoveryMail.isPending}
            >
                Send Email
            </Button>
        </form>
    );
};
