import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableUser from "../../components/tables/BasicTables/BasicTableUser";
import { useEffect } from "react";
import api from "../../api/axios";

export default function UsersTable() {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Users Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Users Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard title="Liste des u">
          <BasicTableUser />
        </ComponentCard>
      </div>
    </>
  );
}
