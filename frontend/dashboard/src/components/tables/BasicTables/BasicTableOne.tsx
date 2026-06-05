import Badge from "../../ui/badge/Badge";
import DataTable from "react-data-table-component";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Table Data
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-19.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

// Columns
const columns = [
  {
    name: "User",
    cell: (row: Order) => (
      <div className="flex items-center gap-3 py-3">
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <img
            width={40}
            height={40}
            src={row.user.image}
            alt={row.user.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div>
          <span className="block font-medium text-gray-800 dark:text-white/90">
            {row.user.name}
          </span>

          <span className="block text-sm text-gray-500 dark:text-gray-400">
            {row.user.role}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    grow: 2,
  },

  {
    name: "Project",
    selector: (row: Order) => row.projectName,
    sortable: true,
  },

  {
    name: "Team",
    cell: (row: Order) => (
      <div className="flex -space-x-2">
        {row.team.images.map((teamImage, index) => (
          <div
            key={index}
            className="w-8 h-8 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
          >
            <img
              width={32}
              height={32}
              src={teamImage}
              alt={`Team ${index}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    ),
  },

  {
    name: "Status",
    cell: (row: Order) => (
      <Badge
        size="sm"
        color={
          row.status === "Active"
            ? "success"
            : row.status === "Pending"
            ? "warning"
            : "error"
        }
      >
        {row.status}
      </Badge>
    ),
    sortable: true,
  },

  {
    name: "Budget",
    selector: (row: Order) => row.budget,
    sortable: true,
  },
];

// Component
export default function BasicTableOne() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
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
              borderBottomColor: "#E5E7EB",
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
              borderTopWidth: "1px",
              borderTopColor: "#E5E7EB",
              minHeight: "56px",
            },
          },
        }}
      />
    </div>
  );
}