export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Create account</h2>
          <p className="mt-2 text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-500">
            Signup UI will be implemented here using your preferred method (NextAuth forms, Clerk,
            etc.)
          </p>
        </div>
      </div>
    </div>
  );
}
