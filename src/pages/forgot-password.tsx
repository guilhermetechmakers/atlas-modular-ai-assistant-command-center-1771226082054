import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requestPasswordReset } from '@/api/auth'
import type { ApiError } from '@/lib/api'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    document.title = 'Reset password | Atlas'
    return () => {
      document.title = 'Atlas'
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: FormValues) {
    try {
      await requestPasswordReset({ email: data.email })
      setIsSuccess(true)
      toast.success('Check your email for the reset link')
    } catch (err) {
      const apiError = err as ApiError
      const message =
        apiError?.message ?? 'Something went wrong. Please try again or contact support.'
      toast.error(message)
    }
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
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                If an account exists for that address, we&apos;ve sent a password reset link. It may
                take a few minutes to arrive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive an email? Check spam or{' '}
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="font-medium text-primary hover:underline focus-ring rounded"
                >
                  try again
                </button>
                .
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <Link to="/login" className="inline-flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
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
              <Mail className="h-6 w-6" />
            </span>
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a secure link to set a new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="forgot-email"
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
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send reset link
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
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
