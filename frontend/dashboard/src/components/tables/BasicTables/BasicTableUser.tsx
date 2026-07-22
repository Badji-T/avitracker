

import trash from "../../../icons/trash.svg";
import pencil from "../../../icons/pencil.svg";

import Badge from "../../ui/badge/Badge";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
//import axios from "axios";

interface User {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
// Columns
const columns = [
  {
    name: "Username",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.username}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    grow: 2,
  },

  {
    name: "Nom",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.nom}
          </span>
        </div>
      </div>
    ),
    sortable: true,
  },

  {
    name: "Prenom",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.prenom}
          </span>
        </div>
      </div>
    ),
    sortable: true,
  },

  {
    name: "Role",
    cell: (row: User) => (
      <Badge
        size="sm"
        color={
          row.role === "admin"
            ? "warning"
            : row.role === "user"
            ? "success"
            : "error"
        }
      >
        {row.role}
      </Badge>
    ),
    sortable: true,
  },

  {
    name: "Telephone",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.tel}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    grow: 3,
  },

  {
    name: "Email(facultatif)",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.email ?? "N/A"}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    grow: 3,
  },

  {
    name: "Date creation",
    cell: (row: User) => (
      <div className="flex items-center gap-3 py-3">
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/50">
            {row.created_at.split("T")[0]}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    grow: 3,
  },

  {
    name: "Actions",
    selector: (row: User) => row.created_at.split("T")[0],
    sortable: true,
    cell: (row: User) => (
      <div className="flex items-center gap-4">
        {/* Bouton Modifier */}
      <button
        onClick={() => console.log("Edit user:", row.id)} 
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-blue-200 text-blue-500 bg-orange-400 transition hover:bg-blue-50"
      >
        <img src={pencil} alt="Edit" className="w-5 h-5" />
      </button>

      {/* Bouton Supprimer */}
      <button
        onClick={() => console.log("Delete user:", row.id)} 
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-red-200 text-red-500 bg-red-400 transition hover:bg-red-50"
      >
        <img src={trash} alt="Trash" className="w-5 h-5" />
      </button>
      </div>
    ),
  },
];

// Component
export default function BasicTableOne() {
  // Recuperation des données depuis l'API
  const [tableData, setTableData] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");

        setTableData(response.data);

        console.log(response.data);
      } catch (error) {
        console.error("Erreur chargement données :", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    
    <div className="w-full overflow-x-auto  rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        highlightOnHover
        responsive
        striped
        customStyles={{
          table: {
            style: {
              backgroundColor: "transparent",
            },
          },

          headRow: {
            style: {
              backgroundColor: "transparent",
              borderBottomWidth: "1px",
              borderBottomColor: "#6B7280",
              minHeight: "56px",
            },
          },

          headCells: {
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "#6B7280",
            },
          },

          rows: {
            style: {
              minHeight: "72px",
              fontSize: "14px",
              backgroundColor: "transparent",
            },
          },

          pagination: {
            style: {
              backgroundColor: "transparent",
              borderTopWidth: "1px",
              borderTopColor: "#6B7280",
              minHeight: "56px",
              color: "#676d79",
            },
          },
        }}
      />
    </div>
  );
}