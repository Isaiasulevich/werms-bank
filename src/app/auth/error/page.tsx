// app/auth/error/page.tsx

export default function AuthError() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Login Failed</h1>
        <p className="mt-2 text-red-600">Something went wrong during login. Please try again.</p>
      </div>
    )
}