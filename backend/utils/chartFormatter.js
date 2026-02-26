class ChartFormatter {
  static formatMonthlyGrowth(data, label) {
    const labels = [];
    const values = [];

    data.forEach((item) => {
      const { year, month } = item._id;

      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "short",
      });

      labels.push(`${monthName} ${year}`);
      values.push(item.count);
    });

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
        },
      ],
    };
  }

  static formatCategoryChart(data, label = "Recipes") {
    const labels = data.map((item) => item._id);
    const values = data.map((item) => item.count);

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
        },
      ],
    };
  }
}

module.exports = ChartFormatter;
