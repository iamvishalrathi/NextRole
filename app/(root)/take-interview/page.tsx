import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { checkProfileCompletion } from '@/lib/actions/general.actions'

const TakeInterviewIndexPage = async () => {
  const user = await getCurrentUser();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/sign-in');
  }

  // Check if profile is completed
  const isProfileCompleted = await checkProfileCompletion(user.id);
  
  if (!isProfileCompleted) {
    redirect(`/user/${user.id}/profile/complete`);
  }

  // Redirect to discover page to select an interview
  redirect('/discover');
}

export default TakeInterviewIndexPage
