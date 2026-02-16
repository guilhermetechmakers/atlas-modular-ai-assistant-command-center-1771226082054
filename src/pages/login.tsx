import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(_data: FormValues) {
    // TODO: auth API
    return Promise.resolve()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-workspace px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Search className="h-5 w-5" aria-hidden />
            </span>
            Atlas
          </Link>
        </div>
        <Card className="border-border bg-card-surface">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Use your email or connect with GitHub / Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  hasError={Boolean(errors.email)}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive" role="alert">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  hasError={Boolean(errors.password)}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive" role="alert">{errors.password.message}</p>
                )}
              </div>
              <p className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline focus-ring rounded"
                >
                  Forgot password?
                </Link>
              </p>
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign in
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
                <span className="bg-card-surface px-2">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="w-full" asChild>
                <a href="/api/auth/github" className="inline-flex items-center justify-center gap-2">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
              <Button type="button" variant="outline" className="w-full" asChild>
                <a href="/api/auth/google" className="inline-flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" /> Google
                </a>
              </Button>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-white transition-colors">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
