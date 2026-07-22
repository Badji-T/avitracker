import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="Connexions des utilisateurs | Avitracker"
        description="cette page affiche un graphique linéaire représentant la fréquence de connexion des utilisateurs sur la plateforme Avitracker."
      />
      <PageBreadcrumb pageTitle="Statistiques d'évolution" />
      <div className="space-y-6">
          <StatisticsChart />
      </div>
    </>
  );
}
