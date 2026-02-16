import { apiPost } from '@/lib/api'

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
