const { User } = require("../models");
const { fn, col, Op } = require("sequelize");

//Bar Chart
exports.getRegistrationsByMonth = async (req, res) => {
  try {
    const stats = await User.findAll({
      attributes: [
        [fn("MONTH", col("created_at")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      group: [fn("MONTH", col("created_at"))],
      order: [[fn("MONTH", col("created_at")), "ASC"]],
      raw: true,
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

//Line Chart
exports.getRegistrationsAndLogins = async (req, res) => {
  try {
    const registrations = await User.findAll({
      attributes: [
        [fn("MONTH", col("created_at")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      group: [fn("MONTH", col("created_at"))],
      raw: true,
    });

    const logins = await User.findAll({
      attributes: [
        [fn("MONTH", col("last_login")), "month"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: {
        last_login: {
          [Op.ne]: null,
        },
      },
      group: [fn("MONTH", col("last_login"))],
      raw: true,
    });

    const data = [];

    for (let month = 1; month <= 12; month++) {
      const registration = registrations.find(
        (r) => Number(r.month) === month
      );

      const login = logins.find(
        (l) => Number(l.month) === month
      );

      data.push({
        month,
        registrations: registration
          ? Number(registration.total)
          : 0,
        logins: login
          ? Number(login.total)
          : 0,
      });
    }

    res.json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
    });
  }
};