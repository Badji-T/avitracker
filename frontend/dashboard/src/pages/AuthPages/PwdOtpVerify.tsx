import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import PwdOtpVerify from "../../components/auth/PwdOtpVerifyForm";

export default function PwdOtpVerifyPage() {
  return (
    <>
      <PageMeta
        title="Avitracker"
        description="This is an app for farmers"
      />
      <AuthLayout>
        <PwdOtpVerify />
      </AuthLayout>
    </>
  );
}
