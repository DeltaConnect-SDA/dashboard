import { publicAPI } from "@/api/backend";
import { useAuth } from "@/context/AuthProvider";
import { Card, Flex, Grid, Metric, Text } from "@tremor/react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Navigate, json } from "react-router-dom";

export const KPICard = ({ title, icon, value, description, loading }) => {
  if (loading) {
    return (
      <Card className="p-6 shadow">
        <Flex
          justifyContent="between"
          alignItems="center"
          className="truncate space-x-3 text-tremor-content-strong"
        >
          <Text className="text-tremor-content-strong font-semibold pb-2">
            <Skeleton width={70} />
          </Text>
          <Skeleton width={20} />
        </Flex>
        <Metric className="text-tremor-content-strong">
          <Skeleton width={100} />
        </Metric>
        <Flex justifyContent="start" className="space-x-2">
          <Flex justifyContent="start" className="space-x-1 truncate">
            <Text>
              <Skeleton width={80} />
            </Text>
          </Flex>
        </Flex>
      </Card>
    );
  } else {
    return (
      <Card className="p-6 shadow">
        <Flex
          justifyContent="between"
          alignItems="center"
          className="truncate space-x-3 text-tremor-content-strong"
        >
          <Text className="text-tremor-content-strong font-semibold pb-2">
            {title}
          </Text>
          {icon}
        </Flex>
        <Metric className="text-tremor-content-strong">{value}</Metric>
        <Flex justifyContent="start" className="space-x-2">
          <Flex justifyContent="start" className="space-x-1 truncate">
            <Text>{description}</Text>
          </Flex>
        </Flex>
      </Card>
    );
  }
};

export type KPI = {
  complaintInMonth: string;
  complaintInDay: string;
  complaintWaiting: string;
  verificationRequests: string;
  users: string;
};

const KPISection = () => {
  const { logout } = useAuth();
  const [KPI, setKPI] = useState<KPI>({
    complaintInDay: "Loading...",
    complaintInMonth: "Loading...",
    complaintWaiting: "Loading...",
    verificationRequests: "Loading...",
    users: "Loading....",
  });
  const [isLoading, setIsLoading] = useState(true);
  const handleKpi = async () => {
    try {
      const response = await publicAPI.get("v1/analytics/kpi");

      const { data } = response.data;
      setIsLoading(false);
      setKPI(data);
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
    handleKpi();
    const intervalId = setInterval(() => {
      handleKpi(); // Fetch data every 15 Seconds
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Grid numItemsMd={2} numItemsLg={5} className="gap-4 mt-6">
      <KPICard
        loading={isLoading}
        title={"Laporan Bulan Ini"}
        description={"Laporan"}
        value={KPI.complaintInMonth}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g fillRule="nonzero" transform="translate(-192)">
                <g transform="translate(192)">
                  <path
                    fillRule="nonzero"
                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M14 3a2 2 0 012 2v3h4a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h4V5a2 2 0 012-2h4zm0 2h-4v14h4V5zm6 5h-4v9h4v-9zM8 13H4v6h4v-6z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        }
      />
      <KPICard
        loading={isLoading}
        title={"Laporan Hari Ini"}
        description={"Laporan"}
        value={KPI.complaintInDay}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g fillRule="nonzero" transform="translate(-624 -96)">
                <g transform="translate(624 96)">
                  <path d="M24 0v24H0V0h24zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018zm.264-.113l-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092z"></path>
                  <path
                    fill="currentColor"
                    d="M18.242 14.03a1 1 0 01.728 1.213L18.28 18H19v-1a1 1 0 112 0v1a1 1 0 110 2v1a1 1 0 11-2 0v-1h-2a1 1 0 01-.97-1.242l1-4a1 1 0 011.212-.728zM13.5 14a2.5 2.5 0 012.495 2.336L16 16.5v.325c0 .6-.19 1.181-.541 1.663l-.14.175L14.175 20H15a1 1 0 01.117 1.993L15 22h-3a1 1 0 01-.837-1.548l.078-.103 2.56-2.987a.825.825 0 00.19-.42l.009-.117V16.5a.5.5 0 00-1 0 1 1 0 11-2 0 2.5 2.5 0 012.5-2.5zM12 3c4.195 0 7.717 2.87 8.716 6.75a1 1 0 11-1.937.5A7 7 0 108.5 18.064a1 1 0 01-1 1.73A9 9 0 0112 3zm0 4a1 1 0 01.993.883L13 8v4a1 1 0 01-.883.993L12 13h-2a1 1 0 01-.117-1.993L10 11h1V8a1 1 0 011-1z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        }
      />
      <KPICard
        loading={isLoading}
        title={"Laporan Menunggu"}
        description={"Laporan menunggu respons"}
        value={KPI.complaintWaiting}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g fillRule="nonzero" transform="translate(-1440)">
                <g transform="translate(1440)">
                  <path
                    fillRule="nonzero"
                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 2a1 1 0 01.993.883L13 7v4.586l2.707 2.707a1 1 0 01-1.32 1.497l-.094-.083-3-3a1 1 0 01-.284-.576L11 12V7a1 1 0 011-1z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        }
      />
      <KPICard
        loading={isLoading}
        title={"Permintaan Verifikasi"}
        description={"Pnegguna menunggu"}
        value={KPI.verificationRequests}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g fillRule="nonzero" transform="translate(-334 -192)">
                <g transform="translate(334 192)">
                  <path
                    fillRule="nonzero"
                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M10.586 2.1a2 2 0 012.7-.116l.128.117L15.314 4H18a2 2 0 011.994 1.85L20 6v2.686l1.9 1.9a2 2 0 01.116 2.701l-.117.127-1.9 1.9V18a2 2 0 01-1.85 1.995L18 20h-2.685l-1.9 1.9a2 2 0 01-2.701.116l-.127-.116-1.9-1.9H6a2 2 0 01-1.995-1.85L4 18v-2.686l-1.9-1.9a2 2 0 01-.116-2.701l.116-.127 1.9-1.9V6a2 2 0 011.85-1.994L6 4h2.686l1.9-1.9zM12 3.516l-1.9 1.9a2 2 0 01-1.238.577L8.686 6H6v2.686a2 2 0 01-.467 1.285l-.119.13-1.9 1.9 1.9 1.899a2 2 0 01.578 1.238l.008.176V18h2.686a2 2 0 011.285.467l.13.119 1.899 1.9 1.9-1.9a2 2 0 011.238-.578l.176-.008H18v-2.686a2 2 0 01.467-1.285l.119-.13 1.9-1.899-1.9-1.9a2 2 0 01-.578-1.238L18 8.686V6h-2.686a2 2 0 01-1.285-.467l-.13-.119-1.9-1.9zm3.08 5.468a1 1 0 011.497 1.32l-.084.094-4.88 4.88a1.1 1.1 0 01-1.46.086l-.096-.085-2.404-2.404a1 1 0 011.32-1.498l.094.083 1.768 1.768 4.244-4.244z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        }
      />
      <KPICard
        loading={isLoading}
        title={"Jumlah Pengguna"}
        description={"Pengguna DeltaConnect"}
        value={KPI.users}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
              <g transform="translate(-192)">
                <g transform="translate(192)">
                  <path
                    fillRule="nonzero"
                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M12 13c2.396 0 4.575.694 6.178 1.671.8.49 1.484 1.065 1.978 1.69.486.616.844 1.352.844 2.139 0 .845-.411 1.511-1.003 1.986-.56.45-1.299.748-2.084.956-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139.494-.625 1.177-1.2 1.978-1.69C7.425 13.694 9.605 13 12 13zm0 2c-2.023 0-3.843.59-5.136 1.379-.647.394-1.135.822-1.45 1.222-.324.41-.414.72-.414.899 0 .122.037.251.255.426.249.2.682.407 1.344.582C7.917 19.858 9.811 20 12 20c2.19 0 4.083-.143 5.4-.492.663-.175 1.096-.382 1.345-.582.218-.175.255-.304.255-.426 0-.18-.09-.489-.413-.899-.316-.4-.804-.828-1.451-1.222C15.843 15.589 14.023 15 12 15zm0-13a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        }
      />
    </Grid>
  );
};

export default KPISection;
