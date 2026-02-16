/**
 * Login/Signup scope – DB and auth types.
 * Table name in DB: login_signup (slash omitted for SQL compatibility).
 */
export interface LoginSignup {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface SignUpPayload {
  email: string
  password: string
  workspace?: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface AuthSessionResponse {
  user: { id: string; email?: string; email_confirmed_at?: string | null }
}
