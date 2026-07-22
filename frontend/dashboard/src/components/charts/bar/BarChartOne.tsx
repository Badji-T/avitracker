import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getRegistrationsByMonth } from "../../../services/authService";

interface RegistrationStat {
  month: number;
  total: number;
}

export default function BarChartOne() {
  const [series, setSeries] = useState([
    {
      name: "Inscriptions",
      data: Array(12).fill(0),
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats: RegistrationStat[] = await getRegistrationsByMonth();

        // Tableau Jan -> Déc initialisé à 0
        const monthlyData = Array(12).fill(0);

        stats.forEach((item) => {
          monthlyData[item.month - 1] = Number(item.total);
        });

        setSeries([
          {
            name: "Inscriptions",
            data: monthlyData,
          },
        ]);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des statistiques :",
          error
        );
      }
    };

    fetchStats();
  }, []);

  const options: ApexOptions = {
    colors: ["#E65100"],

    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },

    xaxis: {
      categories: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ],

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },

    yaxis: {
      title: {
        text: "Inscriptions",
      },

      min: 0,

      labels: {
        formatter: (value) => Math.round(value).toString(),
      },
    },

    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: true,
      },

      y: {
        formatter: (val: number) =>
          `${val} inscription${val > 1 ? "s" : ""}`,
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistiques
          </h3>

          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Nombre d'inscriptions par mois sur la plateforme
          </p>
        </div>
      </div>
      <div id="chartOne" className="min-w-[1000px]">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={180}
        />
      </div>
    </div>
  );
}