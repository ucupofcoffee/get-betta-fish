import { login } from './actions'

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DD] p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F26522]">
            GBF CMS
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#123F32]">
            Admin Login
          </h1>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Email atau password tidak valid.
          </div>
        )}

        <form action={login} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#123F32]"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#123F32]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#123F32]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-black/15 px-4 py-3 outline-none focus:border-[#123F32]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#F26522] px-4 py-3 font-semibold text-white"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}