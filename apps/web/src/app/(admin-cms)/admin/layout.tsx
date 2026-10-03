import Link from "next/link";

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
  },
  {
    href: "/admin/fishes",
    label: "Fish",
  },
  {
    href: "/admin/assessors",
    label: "Assessors",
  },
  {
    href: "/admin/products",
    label: "Products",
  },
  {
    href: "/admin/education",
    label: "Education",
  },
  {
    href: "/admin/faq",
    label: "FAQ",
  },
  {
    href: "/admin/settings",
    label: "Settings",
  },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F5E8DD]/40">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div>
            <Link
              href="/admin"
              className="text-lg font-bold text-[#123F32]"
            >
              GBF CMS
            </Link>

            <p className="text-xs text-black/45">
              Get Betta Fish
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-[#123F32] transition hover:bg-black/5"
          >
            View Website ↗
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-black/10 bg-white p-4 lg:min-h-[calc(100vh-73px)] lg:border-r lg:border-b-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-black/60 transition hover:bg-[#123F32]/5 hover:text-[#123F32]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}