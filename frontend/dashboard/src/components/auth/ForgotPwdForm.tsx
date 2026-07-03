import { useState } from "react";
import { useNavigate } from "react-router";
import { forgotPassword } from "../../services/authService";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Alert from "../ui/alert/Alert";

export default function ChangePwd() {

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const detectChannel = (identifier: string): "email" | "sms" => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier.trim()) ? "email" : "sms";
  };

  const detectedChannel = formData.identifier.trim() === "" ? "" : detectChannel(formData.identifier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const identifier = formData.identifier.trim();
    const channel = detectChannel(identifier);

    try {
      await forgotPassword({
        identifier,
        channel,
      });

      localStorage.setItem(
        "pendingPasswordReset",
        JSON.stringify({
          identifier,
          channel,
        })
      );

      navigate("/password-otp-verify");
    } catch (error: any) {
      console.log(error.response?.data);
      setErrorMessage(
        error?.response?.data?.error || "Une erreur est survenue"
      );
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Entrez votre email ou numéro de téléphone
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Renseignez votre email ou votre numéro pour recevoir un code de réinitialisation de mot de passe.
          </p>
        </div>

        {/* SUCCESS */}
        {successMessage && (
          <ComponentCard title="Success Alert">
            <Alert
              variant="success"
              title="Valide"
              message={successMessage}
            />
          </ComponentCard>
        )}

        {/* ERROR */}
        {errorMessage && (
          <ComponentCard title="Error Alert">
            <Alert
              variant="error"
              title="Erreur"
              message={errorMessage}
            />
          </ComponentCard>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* EMAIL OU TEL */}
            <div>
              <Label>
                Email ou Numéro <span className="text-error-500">*</span>
              </Label>

              <Input
                placeholder="exemple@domaine.com ou +22312345678"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
              />
            </div>

            <div>
              {detectedChannel && (
                <p className="mt-2 text-xs text-gray-500">
                  Le code sera envoyé par :{" "}
                  <span className="font-medium">
                    {detectedChannel === "email" ? "Email" : "SMS"}
                  </span>
                </p>
              )}
            </div>

            {/* BUTTON */}
            <div>
              <Button
                type="submit"
                className="w-full"
                size="sm"
              >
                Envoyer
              </Button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}