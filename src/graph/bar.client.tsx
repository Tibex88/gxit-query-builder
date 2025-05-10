import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactProps,
} from "highcharts-react-official";

import { Suspense, useEffect, useRef } from "react";
// import { Theme, useTheme } from "remix-themes";

const options: Highcharts.Options = {
  title: {
    text: "",
  },
  credits: {
    enabled: false,
  },
  chart: {
    styledMode: true,
    height: 250,
    type: "bar",
  },
  xAxis: {
    categories: ["Gene", "Protein", "Transcript", "SNP", "GO"],
    title: {
      text: null,
    },
    gridLineWidth: 1,
  },
  yAxis: {
    min: 0,
    title: {
      text: "Count",
      align: "high",
    },
    labels: {
      overflow: "justify",
    },
    gridLineWidth: 0,
  },
  tooltip: {
    valueSuffix: "",
  },
  plotOptions: {
    bar: {
      borderRadius: "50%",
      dataLabels: {
        enabled: true,
      },
      pointPadding: 0,
      groupPadding: 0,
    },
  },
  series: [
    {
      colorByPoint: true,
      pointPadding: 10,
      groupPadding: 0,
      borderWidth: 0,
      pointWidth: 10,
      data: [620, 342, 202, 171, 31],
      showInLegend: false,
      type: "bar",
      name: "Count",
    },
  ],
};

export default function Bar({ categories, data }: any) {
  // const [theme] = useTheme();
  const props = {
    ...options,
    xAxis: { ...options.xAxis, categories },
    series: [{ ...options.series?.[0], data, type: "bar" }],
  };

  return (
    <Suspense fallback={null}>
      <HighchartsReact
        highcharts={Highcharts}
        options={props}
        containerProps={{
          className:
            // theme == Theme.DARK ?
            //  "highcharts-dark" :
              "highcharts-light",
        }}
      />
    </Suspense>
  );
}
