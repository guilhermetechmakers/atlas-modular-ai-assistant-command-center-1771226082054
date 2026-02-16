import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPassword } from '@/api/auth'
import type { ApiError } from '@/lib/api'

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include uppercase, lowercase, and a number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasValidToken, setHasValidToken] = useState(true)

  useEffect(() => {
    document.title = 'Set new password | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  useEffect(() => {
    if (token === null || token === '') {
      setHasValidToken(false)
    }
  }, [token])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  async function onSubmit(data: FormValues) {
    if (!token) {
      toast.error('Invalid or missing reset link')
      return
    }
    try {
      await resetPassword({ token, newPassword: data.newPassword })
      setIsSuccess(true)
      toast.success('Your password has been updated')
    } catch (err) {
      const apiError = err as ApiError
      const message =
        apiError?.message ?? 'Could not reset password. The link may have expired. Request a new one.'
      toast.error(message)
    }
  }

  if (!hasValidToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-workspace px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-8 flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Search className="h-5 w-5" aria-hidden />
              </span>
              Atlas
            </Link>
          </div>
          <Card className="border-border bg-card-surface">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Invalid reset link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired. Request a new link below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/forgot-password">Request new reset link</Link>
              </Button>
            </CardContent>
          </Card>
          <p className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-white"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-workspace px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="mb-8 flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Search className="h-5 w-5" aria-hidden />
              </span>
              Atlas
            </Link>
          </div>
          <Card className="border-border bg-card-surface">
            <CardHeader className="text-center">
              <span
                className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"
                aria-hidden
              >
                <CheckCircle className="h-6 w-6" />
              </span>
              <CardTitle className="text-xl">Password updated</CardTitle>
              <CardDescription>
                Your password has been changed. You can now sign in with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/login" className="inline-flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Sign in
                </Link>
              </Button>
            </CardContent>
          </Card>
          <p className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-white"
            >
              Back to home
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-workspace px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Search className="h-5 w-5" aria-hidden />
            </span>
            Atlas
          </Link>
        </div>
        <Card className="border-border bg-card-surface">
          <CardHeader className="text-center">
            <span
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"
              aria-hidden
            >
              <Lock className="h-6 w-6" />
            </span>
            <CardTitle className="text-xl">Set new password</CardTitle>
            <CardDescription>
              Enter your new password below. Use at least 8 characters with uppercase, lowercase,
              and a number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-new-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  New password
                </label>
                <Input
                  id="reset-new-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  hasError={Boolean(errors.newPassword)}
                  {...register('newPassword')}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Confirm password
                </label>
                <Input
                  id="reset-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  hasError={Boolean(errors.confirmPassword)}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Update password
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition-colors hover:text-white"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
