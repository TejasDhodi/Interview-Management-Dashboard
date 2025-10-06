import { LoginForm } from "@/components/auth/login-page"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Interview Manager
          </h1>
          <p className="text-muted-foreground">Streamline your interview process</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
