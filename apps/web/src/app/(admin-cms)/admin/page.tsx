import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { logout } from './actions'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: adminProfile } = await supabase
    .from('admin_profiles')
    .select('id, name, role, is_active')
    .eq('id', user.id)
    .single()

  if (!adminProfile || !adminProfile.is_active) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <main className="p-8">
      <p className="text-sm text-[#F26522]">GBF CMS</p>

      <h1 className="mt-2 text-2xl font-bold text-[#123F32]">
        Halo, {adminProfile.name}
      </h1>

      <p className="mt-2 text-sm text-black/60">
        Role: {adminProfile.role}
      </p>

      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="rounded-lg border border-[#123F32] px-4 py-2 text-sm font-semibold text-[#123F32]"
        >
          Logout
        </button>
      </form>
    </main>
  )
}