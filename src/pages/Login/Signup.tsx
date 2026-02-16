import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  AuthForm,
  OAuthButtons,
  SSOMFACTA,
  FooterLinks,
  EmailVerificationStatus,
} from '@/components/login-signup'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signUp, signIn, resendVerificationEmail } from '@/api/auth'
import type { ApiError } from '@/lib/api'
import type { AuthFormValues, SignupFormValues } from '@/components/login-signup'

type Step = 'auth' | 'verify_email'

export default function LoginSignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode')
  const initialMode = modeParam === 'login' || modeParam === 'signup' ? modeParam : 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [step, setStep] = useState<Step>('auth')

  useEffect(() => {
    const m = searchParams.get('mode')
    if (m === 'login' || m === 'signup') setMode(m)
  }, [searchParams])
  const [pendingEmail, setPendingEmail] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const title = mode === 'login' ? 'Sign in | Atlas' : 'Create account | Atlas'
    document.title = title
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc?.setAttribute(
      'content',
      mode === 'login'
        ? 'Sign in to Atlas with email or OAuth (GitHub, Google).'
        : 'Create your Atlas account and workspace. Email verification supported.'
    )
    return () => {
      document.title = 'Atlas'
    }
  }, [mode])

  const handleAuthSubmit = async (data: AuthFormValues | SignupFormValues) => {
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn({ email: data.email, password: data.password })
        toast.success('Signed in successfully')
        navigate('/dashboard', { replace: true })
        return
      }
      const signupData = data as SignupFormValues
      await signUp({
        email: signupData.email,
        password: signupData.password,
        workspace: signupData.workspace,
      })
      setPendingEmail(signupData.email)
      setStep('verify_email')
      toast.success('Account created. Please verify your email.')
    } catch (err) {
      const apiError = err as ApiError
      const message =
        apiError?.message ?? 'Something went wrong. Please try again or contact support.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    if (!pendingEmail) return
    setIsResending(true)
    try {
      await resendVerificationEmail({ email: pendingEmail })
      toast.success('Verification email sent. Check your inbox.')
    } catch (err) {
      const apiError = err as ApiError
      toast.error(apiError?.message ?? 'Failed to resend. Try again later.')
    } finally {
      setIsResending(false)
    }
  }

  // Email verification pending view
  if (step === 'verify_email' && pendingEmail) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-workspace px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan/10 animate-gradient-bg bg-[length:200%_200%] pointer-events-none" aria-hidden />
        <div className="relative w-full max-w-md animate-fade-in-up">
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
          <Card className="border border-border bg-card-surface shadow-card transition-all duration-200 hover:shadow-card-hover">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                We need to confirm your email address before you can sign in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmailVerificationStatus
                email={pendingEmail}
                isResending={isResending}
                onResend={handleResendVerification}
              />
              <p className="text-center text-sm text-muted-foreground">
                Already verified?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setStep('auth')
                    setPendingEmail('')
                    setMode('login')
                  }}
                  className="font-medium text-primary hover:underline focus-ring rounded"
                >
                  Sign in
                </button>
              </p>
            </CardContent>
          </Card>
          <FooterLinks className="mt-8" />
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

  // Main auth card: login or signup form
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-workspace px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan/10 animate-gradient-bg bg-[length:200%_200%] pointer-events-none" aria-hidden />
      <div className="relative w-full max-w-md animate-fade-in-up">
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
        <Card className="border-border bg-card-surface transition-all duration-200 hover:shadow-card-hover">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Use your email or connect with GitHub / Google'
                : 'Create your workspace and connect integrations'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthForm
              mode={mode}
              onSubmit={handleAuthSubmit}
              isLoading={isSubmitting}
              forgotPasswordHref="/forgot-password"
            />
            <OAuthButtons basePath="/api/auth" />
            {mode === 'signup' && <SSOMFACTA />}
            <p className="text-center text-sm text-muted-foreground">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-medium text-primary hover:underline focus-ring rounded"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-medium text-primary hover:underline focus-ring rounded"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
        <FooterLinks className="mt-8" />
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
