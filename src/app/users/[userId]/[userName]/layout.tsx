import UserProfile from "./UserProfile";
export default function ProfilePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProfile>{children}</UserProfile>;
}
