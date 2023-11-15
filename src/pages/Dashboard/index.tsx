/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "@/components/Navbar";
import { AreaChart, Card, Text, Title } from "@tremor/react";
import KPISection from "./components/KpiSection";
import { useEffect, useState } from "react";
import { publicAPI } from "@/api/backend";
import Skeleton from "react-loading-skeleton";
import { APP_NAME } from "@/config/config";
import Helemet from "react-helmet";
import { useAuth } from "@/context/AuthProvider";
import { Navigate, json } from "react-router-dom";
import { Container } from "@/components";

const valueFormatter = (number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

export type AnalyticsData = {
  date: string;
  Selesai: number;
  Total: number;
};

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  const handleAnalytics = async () => {
    try {
      const response = await publicAPI.get("analytics/complaints");

      const { data } = response.data;

      setIsLoading(false);
      setAnalyticsData(data);
    } catch (err) {
      if (err.response.status === 401) {
        logout();
        return <Navigate to="/login" replace />;
      }
      // setIsLoading(false);
      console.error(err);
      console.error(err.response, "response");
      throw json(
        {
          err,
        },
        {
          status: err.response.status,
        }
      );
    }
  };

  useEffect(() => {
    handleAnalytics();
    const intervalId = setInterval(() => {
      handleAnalytics(); // Fetch data every 15 seconds
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <Helemet>
        <title>{`Dashboard | ${APP_NAME}`}</title>
      </Helemet>
      <Navbar />
      <Container>
        <Title className="font-bold text-2xl text-black">Dashboard</Title>
        <KPISection />
        <div className="mt-6">
          <Card>
            <Title>Laporan Bulan Ini</Title>
            <Text>
              Grafik laporan pengguna pada bulan{" "}
              {new Date().toLocaleDateString("id-ID", { month: "long" })}
            </Text>
            {isLoading ? (
              <Skeleton className="h-80" />
            ) : (
              <AreaChart
                className="mt-8 h-80"
                data={analyticsData}
                categories={["Baru", "Selesai"]}
                index="date"
                colors={["zinc", "emerald"]}
                yAxisWidth={60}
                valueFormatter={valueFormatter}
              />
            )}
          </Card>
        </div>
      </Container>
    </>
  );
}
