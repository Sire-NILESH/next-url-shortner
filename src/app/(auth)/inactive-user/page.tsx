import AutoLogoutByStatus from "@/components/auth/auto-logout-by-status";
import { getUserStatus } from "@/server/actions/users/get-user-status";
import { UserRoundX } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Inactive User | Shrinkify",
  description:
    "Your account is currently inactive, please contact support to enquire further.",
};

const InactiveUserPage = async () => {
  const userStatus = await getUserStatus();

  if (!userStatus.success) {
    return null;
  }

  if (userStatus.data != "inactive") redirect("/");

  return (
    <>
      <AutoLogoutByStatus userStatus={userStatus.data} />

      <div className="my-6 md:my-20 flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center mb-6 gap-4">
            <div className="size-16 rounded-full flex items-center justify-center bg-muted">
              <UserRoundX className="size-8 text-foreground" />
            </div>
          </div>

          <h1 className="text-4xl mb-4 !font-bold boldText">
            Your Account is inactive
          </h1>
          <p className="text-muted-foreground mb-6">
            Your account is currently inactive, please contact support to
            enquire further.
          </p>
        </div>
      </div>
    </>
  );
};

export default InactiveUserPage;
