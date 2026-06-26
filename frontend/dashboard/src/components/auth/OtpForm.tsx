import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Alert from "../ui/alert/Alert";
import { LockIcon } from "../../icons";
import { registerUser, sendOTP } from "../../services/authService";

export default function VerifyOTPForm() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Recuperer les données formulaire de l'inscription depuis le localStorage
  const savedData = localStorage.getItem("pendingRegistration");

  if (!savedData) {
    console.error("Les informations d'inscription sont introuvables.");
    return;
  }

  const formData = JSON.parse(savedData);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      setErrorMessage(
        "Veuillez saisir le code complet."
      );
      return;
    }

    try {
      await registerUser({
        ...formData,
        code,
      });

      setSuccessMessage(
        "Code vérifié avec succès."
      );

      setTimeout(() => {
        navigate("/signin");
      }, 1000);

      localStorage.removeItem("pendingRegistration");

    } catch (error) {
      setErrorMessage(
        "Code invalide ou expiré."
      );
      console.log("Erreur lors de la vérification du code:", error);
    }
  };

  const handleResend = async () => {
    try {
      const savedData = JSON.parse(
        localStorage.getItem("pendingRegistration")!
      );

      await sendOTP(savedData);

      setSuccessMessage("Un nouveau code a été envoyé.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Impossible de renvoyer le code.");
      console.log("Erreur lors du renvoi du code:", error);}
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signup"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="size-5" />
          Retour
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-brand-50 dark:bg-brand-500/10">
            <LockIcon fontSize={30} color="gray"></LockIcon>
          </div>

          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white sm:text-title-md">
            Vérification du code
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nous avons envoyé un code de vérification
            à votre numéro de téléphone.
          </p>
        </div>

        {successMessage && (
          <ComponentCard title="Success Alert">
            <Alert
              variant="success"
              title="Succès"
              message={successMessage}
            />
          </ComponentCard>
        )}

        {errorMessage && (
          <ComponentCard title="Error Alert">
            <Alert
              variant="error"
              title="Erreur"
              message={errorMessage}
            />
          </ComponentCard>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(
                    e.target.value,
                    index
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                className="
                  w-12 h-14
                  text-center
                  text-xl
                  font-semibold
                  border
                  rounded-lg
                  border-gray-300
                  dark:border-gray-700
                  dark:bg-gray-900
                  focus:border-brand-500
                  focus:ring-2
                  focus:ring-brand-500/20
                  outline-none
                "
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Vous n'avez pas reçu le code ?
            </p>

            <button
              type="button"
              className="mt-2 text-sm font-medium text-brand-500 hover:text-brand-600"
              onClick={handleResend}
            >
              Renvoyer le code
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="sm"
          >
            Vérifier
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/signup"
            className="text-sm text-brand-500 hover:text-brand-600"
          >
            Modifier mes informations
          </Link>
        </div>
      </div>
    </div>
  );
}