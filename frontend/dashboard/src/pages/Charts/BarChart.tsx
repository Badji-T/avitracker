import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function BarChart() {
  return (
    <div>
      <PageMeta
        title="Connexions des utilisateurs | Avitracker"
        description="cette page affiche un graphique linéaire représentant la fréquence de connexion des utilisateurs sur la plateforme Avitracker."
      />
      <PageBreadcrumb pageTitle="Statistiques d'inscriptions" />
      <div className="space-y-6">
          <BarChartOne />
      </div>
    </div>
  );
}
