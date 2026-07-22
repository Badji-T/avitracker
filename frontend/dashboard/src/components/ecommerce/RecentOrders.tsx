import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { get_last_login } from "../../services/authService";

interface UserLogin {
  id: string;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  last_login: string | null;
}

const getStatus = (date: string |null) => {
  if (!date) {
    return {
      label: "Inactif",
      color: "error" as const,
    };
  }

  const diff = Date.now() - new Date(date).getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  if (days < 1) {
    return {
      label: "Actif",
      color: "success" as const,
    };
  }

  if (days < 7) {
    return {
      label: "Récent",
      color: "warning" as const,
    };
  }

  return {
    label: "Inactif",
    color: "error" as const,
  };
};

export default function RecentOrders() {
  const [users, setUsers] = useState<UserLogin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogins = async () => {
      try {
        const data = await get_last_login();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLogins();
  }, []);

  if (loading) {
    return <p className="p-4">Chargement...</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Connexions récentes
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Utilisateur
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Téléphone
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Dernière connexion
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Statut
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((user) => {
              const status = getStatus(user.last_login);

              return (
                <TableRow key={user.id}>
                  <TableCell className="py-3">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-white/50">
                        {user.nom} {user.prenom}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.tel}
                  </TableCell>

                  <TableCell className="py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("fr-FR")
                      : "Jamais connecté"}
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge size="sm" color={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}