import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import PwdReset from "../../components/auth/pwdResetForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Avitracker"
        description="This is an app for farmers"
      />
      <AuthLayout>
        <PwdReset />
      </AuthLayout>
    </>
  );
}
