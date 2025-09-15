// app/(admin)/auth/layout.tsx

export const metadata = {
  title: "Admin Login",
  description: "Login page",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // No AppBar, No Footer
}
