import { clearSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LogoutPage() {
  clearSession();
  redirect('/login');
}
