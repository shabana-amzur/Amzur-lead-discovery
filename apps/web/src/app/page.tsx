import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to leads page as the main entry point
  redirect('/leads');
}
