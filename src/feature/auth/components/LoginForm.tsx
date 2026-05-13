import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
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
import { useAuth } from "../hooks/use-auth";
import { loginSchema, type LoginInput } from "../schemas/login.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function LoginForm() {
  const { isAuthenticated, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setDisableBtn(true);
    await login(values);
    setDisableBtn(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="login-form"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold opacity-70">
                    USER PASSWORD
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            form="login-form"
            className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]"
            disabled={disableBtn}
          >
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
