import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  workspace: z.string().min(1, 'Workspace name is required').max(100, 'Name is too long'),
})

export type CreateWorkspaceFormValues = z.infer<typeof schema>

export interface CreateWorkspaceFlowProps {
  onSubmit: (data: CreateWorkspaceFormValues) => void | Promise<void>
  isLoading?: boolean
  /** Prefill from parent (e.g. after OAuth) */
  defaultName?: string
}

export function CreateWorkspaceFlow({
  onSubmit,
  isLoading = false,
  defaultName = '',
}: CreateWorkspaceFlowProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { workspace: defaultName },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="workspace-name"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Workspace name
        </label>
        <Input
          id="workspace-name"
          placeholder="My Workspace"
          autoComplete="organization"
          hasError={Boolean(errors.workspace)}
          {...register('workspace')}
        />
        {errors.workspace && (
          <p className="mt-1 text-sm text-destructive" role="alert">
            {errors.workspace.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        isLoading={isLoading}
      >
        Create workspace
      </Button>
    </form>
  )
}
