import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emailPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupPasswordSchema = emailPasswordSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  workspace: z.string().min(1, 'Workspace name is required').max(100, 'Name is too long'),
})

export type AuthFormValues = z.infer<typeof emailPasswordSchema>
export type SignupFormValues = z.infer<typeof signupPasswordSchema>

export interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: AuthFormValues | SignupFormValues) => void | Promise<void>
  isLoading?: boolean
  /** For "forgot password" link (login only) */
  forgotPasswordHref?: string
}

export function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  forgotPasswordHref = '/forgot-password',
}: AuthFormProps) {
  const schema = mode === 'signup' ? signupPasswordSchema : emailPasswordSchema
  const [showShake, setShowShake] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues | SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'signup'
        ? { email: '', password: '', workspace: '' }
        : { email: '', password: '' },
  })

  const hasErrors = Object.keys(errors).length > 0
  useEffect(() => {
    if (hasErrors) {
      setShowShake(true)
      const t = setTimeout(() => setShowShake(false), 400)
      return () => clearTimeout(t)
    }
  }, [hasErrors])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 ${showShake ? 'animate-shake' : ''}`}
      aria-invalid={hasErrors}
    >
      <div>
        <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="auth-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="auth-password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          hasError={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      {mode === 'signup' && (
        <div>
          <label
            htmlFor="auth-workspace"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Workspace name
          </label>
          <Input
            id="auth-workspace"
            placeholder="My Workspace"
            autoComplete="organization"
            hasError={Boolean('workspace' in errors && errors.workspace)}
            {...register('workspace')}
          />
          {'workspace' in errors && errors.workspace && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {errors.workspace.message}
            </p>
          )}
        </div>
      )}
      {mode === 'login' && forgotPasswordHref && (
        <p className="text-right">
          <a
            href={forgotPasswordHref}
            className="text-sm font-medium text-primary hover:underline focus-ring rounded"
          >
            Forgot password?
          </a>
        </p>
      )}
      <Button
        type="submit"
        className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        isLoading={isLoading}
      >
        {mode === 'login' ? 'Sign in' : 'Get started'}
      </Button>
    </form>
  )
}
