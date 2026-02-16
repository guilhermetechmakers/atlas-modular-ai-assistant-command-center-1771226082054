import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/routes'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgb(28 28 30)',
            border: '1px solid rgb(39 39 42)',
            color: 'rgb(229 231 235)',
          },
        }}
      />
    </>
  )
}

export default App
