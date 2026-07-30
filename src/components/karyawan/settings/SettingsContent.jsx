import ProfileForm from "./ProfileForm";
import AccountSummary from "./AccountSummary";
import SecurityForm from "./SecurityForm";
import NotificationSettings from "./NotificationSettings";

export default function SettingsContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <AccountSummary />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityForm />
        <NotificationSettings />
      </div>
    </div>
  );
}