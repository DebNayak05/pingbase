import UserProfile from "./UserProfile";
export default function ProfilePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="items-center">
      <UserProfile>{children}</UserProfile>
    </div>
  );
}
