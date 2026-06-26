import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import OtpForm from "../../components/auth/OtpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Avitracker"
        description="This is an app for farmers"
      />
      <AuthLayout>
        <OtpForm />
      </AuthLayout>
    </>
  );
}
