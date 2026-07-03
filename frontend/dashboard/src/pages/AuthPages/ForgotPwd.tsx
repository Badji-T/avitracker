import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import ForgotPwd from "../../components/auth/ForgotPwdForm";

export default function ForgotPwdPage() {
  return (
    <>
      <PageMeta
        title="Avitracker"
        description="This is an app for farmers"
      />
      <AuthLayout>
        <ForgotPwd />
      </AuthLayout>
    </>
  );
}
