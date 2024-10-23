import { redirect } from 'next/navigation'; // Import the redirect function

export default function Home() {
  // Redirect to the /image page immediately
  redirect('/images');
  
  return null; // No need to render anything since we're redirecting
}
