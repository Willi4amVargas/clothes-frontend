import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/use-auth";
import {
  recoveryUserPasswordSchema,
  recoveryUserSchema,
  type RecoveryUser,
  type RecoveryUserPassword,
} from "../schemas/recovery.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

interface ChangePasswordFormProps {
  userCode: string;
  onSuccess?: () => void;
}

const ChangePasswordForm = ({
  userCode,
  onSuccess,
}: ChangePasswordFormProps) => {
  const { changePassword } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);

  const form = useForm<RecoveryUserPassword>({
    resolver: zodResolver(recoveryUserPasswordSchema),
    defaultValues: {
      code: userCode,
      recovery_code: "",
      new_password: "",
    },
  });

  const onSubmitChangePassword = async (values: RecoveryUserPassword) => {
    setDisableBtn(true);
    try {
      await toast.promise(async () => await changePassword(values), {
        pending: "Cambiando contraseña...",
        error: "Error al cambiar la contraseña",
        success: "Contraseña actualizada con éxito",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setDisableBtn(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitChangePassword)}
      id="change-password-form"
      className="space-y-6"
    >
      <input type="hidden" {...form.register("code")} />

      <FieldGroup className="space-y-4">
        <Controller
          name="recovery_code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold opacity-70">
                RECOVERY CODE
              </FieldLabel>
              <Input
                {...field}
                placeholder="Ingresa el código recibido"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="new_password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold opacity-70">
                NEW PASSWORD
              </FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        form="change-password-form"
        className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
        disabled={disableBtn}
      >
        Cambiar Contraseña
      </Button>
    </form>
  );
};

const SendMailForm = ({
  onMailSent,
}: {
  onMailSent: (code: string) => void;
}) => {
  const { sendRecoveryMail } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);

  const form = useForm<RecoveryUser>({
    resolver: zodResolver(recoveryUserSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmitSendMail = async (values: RecoveryUser) => {
    setDisableBtn(true);
    await toast.promise(async () => await sendRecoveryMail(values), {
      pending: "Enviando email...",
      error: "Error enviando email",
      success: "Revisa tu bandeja de entrada",
    });
    onMailSent(values.code);
    setDisableBtn(false);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmitSendMail)}
      id="recovery-form"
      className="space-y-6"
    >
      <FieldGroup className="space-y-4">
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold opacity-70">
                USER CODE
              </FieldLabel>
              <Input
                {...field}
                placeholder="e.g. USR001"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                className="h-11"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        form="recovery-form"
        className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
        disabled={disableBtn}
      >
        Enviar Email
      </Button>
    </form>
  );
};

export const RecoveryForm = () => {
  const [mailSent, setMailSent] = useState(false);
  const [userCode, setUserCode] = useState("");
  const navigate = useNavigate();

  const handleMailSentSuccess = (code: string) => {
    setUserCode(code);
    setMailSent(true);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
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
        {!mailSent ? (
          <SendMailForm onMailSent={handleMailSentSuccess} />
        ) : (
          <ChangePasswordForm
            userCode={userCode}
            onSuccess={() => navigate("/login")}
          />
        )}
        <Button variant={"link"} asChild className="mt-5">
          <Link to={"/login"}>Iniciar Sesión</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
