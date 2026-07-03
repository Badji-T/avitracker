import { useState } from "react";
import {useNavigate } from "react-router";  
import {EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ComponentCard from "../common/ComponentCard";
import Alert from "../ui/alert/Alert";
import {resetPassword } from "../../services/authService";

export default function pwdReset() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      setErrorMessage("");
      setSuccessMessage("");

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Les mots de passe ne correspondent pas.");
        return;
      }

      try {
        await resetPassword({
          resetToken: localStorage.getItem("resetToken"),
          password: formData.password,
        });
  
        setSuccessMessage("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.");
        setErrorMessage("");

        navigate("/signin");
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
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Changer mon mot de passe
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre nouveau mot de passe
            </p>
          </div>
          <div>

            {/* Afficher le message de succès après la connexion réussie*/}
            {successMessage && ( 
              <ComponentCard title="Success Alert">
                <Alert
                  variant="success"
                  title="Valide"
                  message={successMessage}
                />
              </ComponentCard>
            )}          
            {/* Afficher un message d'erreur*/}
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
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Nouveau mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Saisissez le mot de passe"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Confirmez le mot de passe <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Saisissez à nouveau le mot de passe"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Confirmer
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
