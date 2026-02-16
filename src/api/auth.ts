import { apiGet, apiPost } from '@/lib/api'
import type { AuthSessionResponse } from '@/types/login-signup'

export interface RequestPasswordResetPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface AuthMessageResponse {
  message: string
}

/**
 * Request a password reset link for the given email.
 * Backend sends a tokenized link to the user's email.
 */
export async function requestPasswordReset(
  payload: RequestPasswordResetPayload
): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>('/auth/forgot-password', payload)
}

/**
 * Set a new password using the token from the reset link.
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>('/auth/reset-password', payload)
}

/**
 * Sign up with email and password. Optional workspace name for first signup.
 */
export async function signUp(payload: {
  email: string
  password: string
  workspace?: string
}): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>('/auth/signup', payload)
}

/**
 * Sign in with email and password.
 */
export async function signIn(payload: {
  email: string
  password: string
}): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>('/auth/login', payload)
}

/**
 * Resend verification email for the given email address.
 */
export async function resendVerificationEmail(payload: {
  email: string
}): Promise<AuthMessageResponse> {
  return apiPost<AuthMessageResponse>('/auth/resend-verification', payload)
}

/**
 * Get current session; used to check if user is authenticated and email verified.
 */
export async function getSession(): Promise<AuthSessionResponse | null> {
  try {
    return await apiGet<AuthSessionResponse>('/auth/session')
  } catch {
    return null
  }
}
