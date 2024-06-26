/* eslint-disable react-hooks/exhaustive-deps */
import { publicAPI } from "@/api/backend";
import { Container, Navbar } from "@/components";
import { Colors } from "@/constants/colors";
import {
  Badge,
  Bold,
  Button,
  Card,
  Col,
  Flex,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Subtitle,
  Text,
  TextInput,
  Title,
} from "@tremor/react";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import Skeleton from "react-loading-skeleton";
import { useNavigate, useParams } from "react-router-dom";
import Helemet from "react-helmet";
import { APP_NAME } from "@/config/config";
import { Status } from "@/constants/status";
import { ReaderIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthProvider";
import Roles from "@/config/Roles";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import imageCompression from "browser-image-compression";
import { KPICard } from "../Dashboard/components/KpiSection";

const SuggestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [status, setStatus] = useState<any>([]);
  const [officers, setOfficers] = useState<any>([]);
  const [officer, setOfficer] = useState<any>(null);
  const [notes, setNotes] = useState<any>(null);
  const [commentsOrderBy, setCommentsOrderBy] = useState("desc");
  const [commentsPerPage, setCommentsPerPage] = useState(10);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsParentId, setParentId] = useState(1);
  const [comments, setComments] = useState([]);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<{
    forward: {
      success: boolean | null;
      message: string | null;
    };
    verify: {
      success: boolean | null;
      message: string | null;
    };
    decline: {
      success: boolean | null;
      message: string | null;
    };
    process: {
      success: boolean | null;
      message: string | null;
    };
    plan: {
      success: boolean | null;
      message: string | null;
    };
    complete: {
      success: boolean | null;
      message: string | null;
    };
  }>({
    forward: {
      success: null,
      message: null,
    },
    verify: {
      success: null,
      message: null,
    },
    decline: {
      success: null,
      message: null,
    },
    process: {
      success: null,
      message: null,
    },
    plan: {
      success: null,
      message: null,
    },
    complete: {
      success: null,
      message: null,
    },
  });
  // const [selectedImage, setSelectedImage] = useState<number>(0);
  const [statusSelectedImage, setStatusSelectedImage] = useState<number>(0);
  const [readMore, setReadMore] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleData = async () => {
    setIsLoading(true);
    await publicAPI
      .get(`suggestions/${id}/dashboard`)
      .then((res) => {
        const { data } = res.data;
        setData(data);
        setIsLoading(false);
        handleStatus();
      })
      .catch((err) => {
        if (err.response.status === 404) {
          navigate("/404", { replace: true });
        }
        console.error(err);
      });
  };

  const handleStatus = async () => {
    await publicAPI
      .get(`suggestions/${id}/status`)
      .then((res) => {
        const { data } = res.data;
        setStatus(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOfficers = async () => {
    setIsLoading(true);
    try {
      const response = await publicAPI.get(`users/officers`);
      const { data } = response.data;
      setOfficers(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async () => {
    setResponseLoading(true);
    try {
      const response = await publicAPI.patch(`suggestions/verify`, {
        id,
        notes,
      });
      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          verify: {
            success: true,
            message: "Usulan telah diverifikasi.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          verify: {
            success: false,
            message: "Usulan gagal diverifikasi.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        verify: {
          success: false,
          message: "Usulan gagal diverifikasi.",
        },
      });
    }
  };

  const handleComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await publicAPI.get(`suggestions/${id}/comments`);
      const { data } = response.data;
      setComments(data.data);
      setCommentsLoading(false);
    } catch (err) {
      setCommentsLoading(false);
      console.error(err, "Get Comments");
    }
  };

  const handleSearchComments = async (parentId?: number) => {
    setCommentsLoading(true);
    try {
      const params = {
        commentsPage,
        commentsPerPage,
        orderByDate: commentsOrderBy,
        parentId,
      };
      const response = await publicAPI.get(`suggestions/${id}/comments`, {
        params,
      });
      const { data } = response.data;
      setComments((oldComments) => [...oldComments, data.data]);
      setCommentsLoading(false);
    } catch (err) {
      setCommentsLoading(false);
      console.error(err, "Get Comments");
    }
  };

  const handleForward = async () => {
    setResponseLoading(true);
    try {
      const response = await publicAPI.patch(`suggestions/assign`, {
        id,
        roleId: officer,
        notes,
      });
      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          forward: {
            success: true,
            message: "Usulan telah diteruskan.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          forward: {
            success: false,
            message: "Usulan gagal diteruskan.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        forward: {
          success: false,
          message: "Usulan gagal diteruskan.",
        },
      });
    }
  };

  const handleDecline = async () => {
    setResponseLoading(true);
    const formData = new FormData();
    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append(
          "images",
          await imageCompression(selectedImages[i], {
            maxSizeMB: 1,
            useWebWorker: true,
          })
        );
      }
    }
    if (id) formData.append("id", id);
    formData.append("notes", notes);

    try {
      const response = await publicAPI.patch(`suggestions/decline`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          decline: {
            success: true,
            message: "Usulan telah ditolak.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          decline: {
            success: false,
            message: "Usulan gagal ditolak.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        decline: {
          success: false,
          message: "Usulan gagal ditolak.",
        },
      });
    }
  };

  const handleProcess = async () => {
    setResponseLoading(true);
    const formData = new FormData();
    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append(
          "images",
          await imageCompression(selectedImages[i], {
            maxSizeMB: 1,
            useWebWorker: true,
          })
        );
      }
    }
    if (id) formData.append("id", id);
    formData.append("notes", notes);

    try {
      const response = await publicAPI.patch(`suggestions/process`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          process: {
            success: true,
            message: "Usulan telah diproses.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          process: {
            success: false,
            message: "Usulan gagal diproses.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        process: {
          success: false,
          message: "Usulan gagal diproses.",
        },
      });
    }
  };

  const handlePlan = async () => {
    setResponseLoading(true);
    const formData = new FormData();
    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append(
          "images",
          await imageCompression(selectedImages[i], {
            maxSizeMB: 1,
            useWebWorker: true,
          })
        );
      }
    }
    if (id) formData.append("id", id);
    formData.append("notes", notes);

    try {
      const response = await publicAPI.patch(`suggestions/plan`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          plan: {
            success: true,
            message: "Usulan telah direncanakan.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          plan: {
            success: false,
            message: "Usulan gagal direncanakan.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        plan: {
          success: false,
          message: "Usulan gagal direncanakan.",
        },
      });
    }
  };

  const handleComplete = async () => {
    setResponseLoading(true);
    const formData = new FormData();
    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append(
          "images",
          await imageCompression(selectedImages[i], {
            maxSizeMB: 0.5,
            useWebWorker: true,
            initialQuality: 0.5,
            maxWidthOrHeight: 600,
          })
        );
      }
    }
    formData.append("id", id);
    formData.append("notes", notes);

    try {
      const response = await publicAPI.patch(`suggestions/complete`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          decline: {
            success: true,
            message: "Usulan telah diproses.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          decline: {
            success: false,
            message: "Laporan gagal diproses.",
          },
        });
      }
      setResponseLoading(false);
    } catch (err) {
      setResponseLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        decline: {
          success: false,
          message: "Laporan gagal diproses.",
        },
      });
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 4) {
      alert("You can only upload a maximum of 4 files");
      return;
    } else if (event.target.files.length <= 4) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          alert("Invalid file type. Only jpg, jpeg, and png files are allowed");
          setSelectedImages([]);
        } else {
          setSelectedImages(event.target.files);
        }
      }
    }
  };

  const handleLastForward = (data) => {
    const forwarded = [];
    data.SuggestionActivity.map((item) => {
      if (item.title === "Diteruskan") {
        forwarded.push(item);
      }
    });

    return forwarded[forwarded.length - 1];
  };

  useEffect(() => {
    handleData();
    handleOfficers();
    handleComments();
  }, []);

  return (
    <>
      <Helemet>
        <title>{`Usulan | ${APP_NAME}`}</title>
      </Helemet>
      <Navbar />
      <Container>
        <main className="mx-auto">
          {/* Main section */}
          {!data.id ? (
            <Skeleton width={100} />
          ) : (
            <Grid numItemsLg={3} className="mt-6 gap-6">
              <Col>
                <Grid numItemsLg={2} className="gap-4 mt-6">
                  <KPICard
                    loading={isLoading}
                    title={"Jumlah Voting"}
                    description={"Pengguna memvoting"}
                    value={data._count.SuggestionVotes}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="none"
                          strokeWidth="1"
                        >
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
                    title={"Jumlah Komentar"}
                    description={"Pengguna berkomentar"}
                    value={data._count.SuggestionComments}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="none"
                          strokeWidth="1"
                        >
                          <g fillRule="nonzero" transform="translate(-96)">
                            <g transform="translate(96)">
                              <path
                                fillRule="nonzero"
                                d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M16 4a3 3 0 012.995 2.824L19 7v2a3 3 0 012.995 2.824L22 12v4a3 3 0 01-2.824 2.995L19 19v.966c0 1.02-1.143 1.594-1.954 1.033l-.096-.072L14.638 19H11a2.989 2.989 0 01-1.998-.762l-.14-.134L7 19.5c-.791.593-1.906.075-1.994-.879L5 18.5V17a3 3 0 01-2.995-2.824L2 14V7a3 3 0 012.824-2.995L5 4h11zm3 7h-8a1 1 0 00-1 1v4a1 1 0 001 1h3.638a2 2 0 011.28.464l1.088.906A1.5 1.5 0 0118.5 17h.5a1 1 0 001-1v-4a1 1 0 00-1-1zm-3-5H5a1 1 0 00-1 1v7a1 1 0 001 1h.5A1.5 1.5 0 017 16.5v.5l1.01-.757A3.04 3.04 0 018 16v-4a3 3 0 013-3h6V7a1 1 0 00-1-1z"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                  <KPICard
                    loading={isLoading}
                    title={"Voting Mendukung"}
                    description={"Pengguna mendukung"}
                    value={data.upVoteTotal}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="none"
                          strokeWidth="1"
                        >
                          <g
                            fillRule="nonzero"
                            transform="translate(-528 -194)"
                          >
                            <g transform="translate(528 194)">
                              <path d="M24 0v24H0V0h24zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018zm.264-.113l-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092z"></path>
                              <path
                                fill="currentColor"
                                d="M18 3a3 3 0 012.995 2.824L21 6v12a3 3 0 01-2.824 2.995L18 21H6a3 3 0 01-2.995-2.824L3 18V6a3 3 0 012.824-2.995L6 3h12zm0 2H6a1 1 0 00-.993.883L5 6v12a1 1 0 00.883.993L6 19h12a1 1 0 00.993-.883L19 18V6a1 1 0 00-.883-.993L18 5zm-5.293 4.465l2.829 2.828a1 1 0 11-1.415 1.414L12 11.586l-2.121 2.121a1 1 0 01-1.415-1.414l2.829-2.828a1 1 0 011.414 0z"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                  <KPICard
                    loading={isLoading}
                    title={"Voting Menolak"}
                    description={"Pengguna menolak"}
                    value={data.downVoteTotal}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="none"
                          strokeWidth="1"
                        >
                          <g
                            fillRule="nonzero"
                            transform="translate(-384 -194)"
                          >
                            <g transform="translate(384 194)">
                              <path d="M24 0v24H0V0h24zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018zm.264-.113l-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092z"></path>
                              <path
                                fill="currentColor"
                                d="M18 3a3 3 0 012.995 2.824L21 6v12a3 3 0 01-2.824 2.995L18 21H6a3 3 0 01-2.995-2.824L3 18V6a3 3 0 012.824-2.995L6 3h12zm0 2H6a1 1 0 00-.993.883L5 6v12a1 1 0 00.883.993L6 19h12a1 1 0 00.993-.883L19 18V6a1 1 0 00-.883-.993L18 5zm-8.121 5.293L12 12.414l2.121-2.121a1 1 0 011.415 1.414l-2.829 2.829a1 1 0 01-1.414 0l-2.829-2.829a1 1 0 111.415-1.414z"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    }
                  />
                </Grid>
                <Card className="mt-6">
                  <Title className="mb-6 pb-4 border-b">
                    <Bold className="flex flex-row items-center gap-2">
                      Komentar Pengguna ({comments?.length})
                    </Bold>
                  </Title>
                  {!commentsLoading ? (
                    comments.length > 0 ? (
                      comments.map((item) => (
                        <Flex
                          flexDirection="row"
                          alignItems="start"
                          className="gap-2"
                        >
                          <Avatar
                            name={
                              !isLoading
                                ? item.user.firstName + " " + item.user.LastName
                                : "Loading"
                            }
                            email={!isLoading ? item.user.email : "loading"}
                            round
                            size="40"
                            className="aspect-square"
                          />
                          <Flex flexDirection="col" alignItems="start">
                            <Text className="text-dark-tremor-brand-inverted">
                              <Bold>
                                {item.user.firstName + " " + item.user.LastName}
                              </Bold>
                            </Text>
                            <p className="whitespace-pre-wrap text-base font-normal">
                              {item.content}
                            </p>
                          </Flex>
                        </Flex>
                      ))
                    ) : (
                      <p className="ml-[2px] text-sm font-bold text-gray-900 dark:text-white">
                        Belum ada komentar.
                      </p>
                    )
                  ) : (
                    <Flex
                      flexDirection="row"
                      alignItems="start"
                      className="gap-2"
                    >
                      <Skeleton circle height={40} width={40} />
                      <Flex flexDirection="col" alignItems="start">
                        <Skeleton width={100} />
                        <Skeleton width={200} />
                        <Skeleton width={70} />
                      </Flex>
                    </Flex>
                  )}
                </Card>
              </Col>
              <Col>
                <h1 className="text-xl mb-2">
                  <Bold>
                    {isLoading ? <Skeleton width={200} /> : data.title}
                  </Bold>
                </h1>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <Badge
                    className="mb-8"
                    style={{
                      backgroundColor:
                        data.status && data.status.id === Status.WAITING
                          ? Colors.SECONDARY_ORANGE
                          : (data.status &&
                              data.status.id === Status.VERIFICATION) ||
                            (data.status && data.status.id === Status.PROCESS)
                          ? Colors.SECONDARY_TOSCA
                          : (data.status &&
                              data.status.id === Status.CANCELED) ||
                            (data.status && data.status.id === Status.DECLINED)
                          ? Colors.SECONDARY_RED
                          : Colors.SECONDARY_GREEN,

                      color:
                        data.status && data.status.id === Status.WAITING
                          ? Colors.PRIMARY_ORANGE
                          : (data.status &&
                              data.status.id === Status.VERIFICATION) ||
                            (data.status && data.status.id === Status.PROCESS)
                          ? Colors.PRIMARY_TOSCA
                          : (data.status &&
                              data.status.id === Status.CANCELED) ||
                            (data.status && data.status.id === Status.DECLINED)
                          ? Colors.PRIMARY_RED
                          : Colors.PRIMARY_GREEN,
                    }}
                  >
                    {data.status && data.status.title}
                  </Badge>
                )}
                <Subtitle className="mb-4">
                  <Bold>Detail Usulan</Bold>
                </Subtitle>
                <table>
                  <tbody className="text-left align-top">
                    <tr className="border-b">
                      <th className="pr-3">
                        <Bold>Kategori</Bold>
                      </th>
                      <td className="pb-3">
                        <Badge
                          style={{
                            backgroundColor: Colors.LIGHT_GRAY,
                            color: Colors.GRAY,
                          }}
                          className="font-medium"
                        >
                          {isLoading ? (
                            <Skeleton width={70} />
                          ) : (
                            data.category && data.category.title
                          )}
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="pr-3">
                        <Bold>Tanggal</Bold>
                      </th>
                      <td className="pb-3">
                        <Text className="text-dark-tremor-brand-inverted">
                          {isLoading ? (
                            <Skeleton width={100} />
                          ) : (
                            new Date(data.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          )}
                        </Text>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="pr-3">
                        <Bold>Nomor</Bold>
                      </th>
                      <td className="pb-3">
                        <Text className="text-dark-tremor-brand-inverted">
                          {isLoading ? <Skeleton width={70} /> : data.ref_id}
                        </Text>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="pr-3">
                        <Bold>Lokasi</Bold>
                      </th>
                      <td className="pb-3">
                        <Text className="text-dark-tremor-brand-inverted">
                          {isLoading ? <Skeleton width={70} /> : data.location}
                        </Text>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="pr-3">
                        <Bold>Prioritas</Bold>
                      </th>
                      <td className="pb-3">
                        <p
                          className="text-sm"
                          style={
                            !isLoading
                              ? {
                                  color:
                                    data.priority && data.priority.id === 1
                                      ? Colors.PRIMARY_RED
                                      : data.priority && data.priority.id === 2
                                      ? Colors.PRIMARY_ORANGE
                                      : Colors.PRIMARY_YELLOW,
                                }
                              : null
                          }
                        >
                          {isLoading ? (
                            <Skeleton width={70} />
                          ) : (
                            data.priority && data.priority.title
                          )}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Subtitle className="my-4">
                  <Bold>Deskripsi</Bold>
                </Subtitle>
                <p
                  className={`whitespace-pre-wrap text-base font-normal ${
                    !readMore && "line-clamp-3"
                  }`}
                >
                  {isLoading ? (
                    <Skeleton width={70} height={100} />
                  ) : (
                    data.description
                  )}
                </p>
                <button
                  onClick={() => setReadMore(!readMore)}
                  className="text-tremor-brand font-semibold text-sm"
                >
                  {readMore ? "Lebih Sedikit" : "Baca Selengkapnya"}
                </button>
                <Flex
                  justifyContent="start"
                  className="gap-2 border-t mt-4 pt-3"
                >
                  <Avatar
                    name={
                      !isLoading
                        ? data.user.firstName + " " + data.user.LastName
                        : "Loading"
                    }
                    email={!isLoading ? data.user.email : "loading"}
                    round
                    size="40"
                  />
                  <div>
                    <Text className="text-dark-tremor-brand-inverted">
                      <Bold>
                        {isLoading ? (
                          <Skeleton width={30} />
                        ) : (
                          data.user.firstName + " " + data.user.LastName
                        )}
                      </Bold>
                      <Badge
                        size="xs"
                        style={{
                          color: data.user.UserDetail.isVerified
                            ? Colors.PRIMARY_GREEN
                            : Colors.PRIMARY_RED,
                          backgroundColor: data.user.UserDetail.isVerified
                            ? Colors.SECONDARY_GREEN
                            : Colors.SECONDARY_RED,
                        }}
                        className="ml-2"
                      >
                        {data.user.UserDetail.isVerified
                          ? "Terverifikasi"
                          : "Belum Verifikasi"}
                      </Badge>
                    </Text>
                    <Text>
                      {isLoading ? <Skeleton width={70} /> : data.user.phone}
                    </Text>
                  </div>
                </Flex>
                {data.status.id === Status.COMPLETE && (
                  <Card className="mt-6">
                    <Title className="mb-6 pb-4 border-b">
                      <Bold className="flex flex-row items-center gap-2">
                        Penilaian Pengguna •
                        <div className="flex flex-row items-center">
                          <svg
                            className="w-4 h-4 text-yellow-300 mr-1"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                          <p className="ml-[2px] text-sm font-bold text-gray-900 dark:text-white">
                            {(Math.round(data.total_score * 100) / 100).toFixed(
                              1
                            )}
                          </p>
                        </div>
                      </Bold>
                    </Title>
                    {data.SuggestionFeedBack.length > 0 ? (
                      data.SuggestionFeedBack.map((item) => (
                        <Flex
                          flexDirection="row"
                          alignItems="start"
                          className="gap-2"
                        >
                          <Avatar
                            name={
                              !isLoading
                                ? item.user.firstName + " " + item.user.LastName
                                : "Loading"
                            }
                            email={!isLoading ? item.user.email : "loading"}
                            round
                            size="40"
                            className="aspect-square"
                          />
                          <Flex flexDirection="col" alignItems="start">
                            <Text className="text-dark-tremor-brand-inverted">
                              <Bold>
                                {item.user.firstName + " " + item.user.LastName}
                              </Bold>
                            </Text>
                            <Flex justifyContent="start">
                              <svg
                                className="w-4 h-4 text-yellow-300 mr-1"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                              >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                              </svg>
                              <p className="ml-[2px] text-sm font-bold text-gray-900 dark:text-white">
                                {(
                                  Math.round(item.feedackScore * 100) / 100
                                ).toFixed(1)}
                              </p>
                            </Flex>
                            <p className="whitespace-pre-wrap text-base font-normal mt-2">
                              {item.feedbackNote}
                            </p>
                          </Flex>
                        </Flex>
                      ))
                    ) : (
                      <p className="ml-[2px] text-sm font-bold text-gray-900 dark:text-white">
                        Belum ada penilaian.
                      </p>
                    )}
                  </Card>
                )}
              </Col>
              <Col>
                {authState.role !== Roles.SUPER_ADMIN &&
                  data.assignToId &&
                  data.assignTo.type === authState.role && (
                    <Card className="mb-6">
                      <Title className="mb-6 pb-4 border-b">
                        <Bold>Diteruskan Oleh</Bold>
                      </Title>
                      <p>
                        <Bold>
                          {handleLastForward(data)?.user?.role.name || null}
                        </Bold>
                      </p>
                      <div className="p-2 border rounded-lg inline-flex gap-2 items-center mt-[8px]">
                        <ReaderIcon width={30} />
                        <p className="text-sm">
                          {handleLastForward(data)?.notes || null}
                        </p>
                      </div>
                    </Card>
                  )}
                <Card className="mb-6">
                  <Title className="mb-6 pb-4 border-b">
                    <Bold>Respon Usulan</Bold>
                  </Title>
                  <Flex justifyContent="between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setNotes(null)}
                          disabled={!isLoading && data.isVerified}
                          variant="primary"
                          size="xs"
                          color="slate"
                        >
                          Verifikasi
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Verifikasi usulan</DialogTitle>
                          <DialogDescription>
                            Pastikan usulan valid dan tidak duplikat dengan
                            usulan lainnya!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <TextInput
                            minLength={4}
                            onChange={(val) => setNotes(val.target.value)}
                            icon={ReaderIcon}
                            placeholder="Masukkan Catatan (opsional)"
                            className="mb-2"
                          />
                          {responseMessage.verify.message &&
                          responseMessage.verify.success ? (
                            <Text className="text-tremor-brand font-semibold text-sm">
                              {responseMessage.verify.message}
                            </Text>
                          ) : (
                            <Text className="text-red-600 font-semibold text-sm">
                              {responseMessage.verify.message}
                            </Text>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            loading={responseLoading}
                            onClick={() => handleVerify()}
                            type="submit"
                          >
                            Verifikasi
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setNotes(null);
                            setSelectedImages([]);
                          }}
                          disabled={
                            (!isLoading &&
                              data.status.id === Status.DECLINED) ||
                            data.status.id === Status.CANCELED ||
                            data.status.id === Status.COMPLETE
                          }
                          variant="primary"
                          size="xs"
                          color="red"
                        >
                          Tolak
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Tolak usulan</DialogTitle>
                          <DialogDescription>
                            Pastikan anda memiliki dan memberikan alasan
                            penolakan usulan!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="mx-auto w-full">
                            <label
                              htmlFor="bukti-foto-tolak"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Tambahkan Bukti Foto (opsional)
                            </label>
                            <input
                              onChange={handleFileChange}
                              id="bukti-foto-tolak"
                              type="file"
                              multiple
                              accept="image/jpg, image/png, image/jpeg"
                              className="cursor-pointer file:cursor-pointer block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60 file:bg-tremor-brand/50"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Hanya gambar dengan format .jpg/.jpeg/.png.
                            </p>
                          </div>

                          <TextInput
                            minLength={4}
                            required
                            onChange={(val) => setNotes(val.target.value)}
                            icon={ReaderIcon}
                            placeholder="Masukkan Catatan"
                            className="mb-2"
                          />
                          {responseMessage.decline.message &&
                          responseMessage.decline.success ? (
                            <Text className="text-tremor-brand font-semibold text-sm">
                              {responseMessage.decline.message}
                            </Text>
                          ) : (
                            <Text className="text-red-600 font-semibold text-sm">
                              {responseMessage.decline.message}
                            </Text>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            loading={responseLoading}
                            onClick={() =>
                              notes && notes.length >= 4
                                ? handleDecline()
                                : setResponseMessage({
                                    ...responseMessage,
                                    decline: {
                                      message: "Catatan minimal 4 karakter",
                                      success: false,
                                    },
                                  })
                            }
                            type="submit"
                            color="red"
                          >
                            Tolak
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setNotes(null);
                            setSelectedImages([]);
                          }}
                          disabled={
                            (!isLoading &&
                              data.status.id === Status.COMPLETE) ||
                            !data.isVerified
                          }
                          variant="primary"
                          size="xs"
                          color="blue"
                        >
                          Rencanakan
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Rencanakan usulan</DialogTitle>
                          <DialogDescription>
                            Lampirkan catatan dan foto untuk meyakinkan
                            pengguna!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="mx-auto w-full">
                            <label
                              htmlFor="bukti-foto-direncanakan"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Tambahkan Bukti Foto (opsional)
                            </label>
                            <input
                              required
                              onChange={handleFileChange}
                              id="bukti-foto-direncanakan"
                              type="file"
                              multiple
                              accept="image/jpg, image/png, image/jpeg"
                              className="cursor-pointer file:cursor-pointer block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60 file:bg-tremor-brand/50"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Hanya gambar dengan format .jpg/.jpeg/.png.
                            </p>
                          </div>

                          <TextInput
                            minLength={4}
                            required
                            onChange={(val) => setNotes(val.target.value)}
                            icon={ReaderIcon}
                            placeholder="Masukkan Catatan"
                            className="mb-2"
                          />
                          {responseMessage.plan.message &&
                          responseMessage.plan.success ? (
                            <Text className="text-tremor-brand font-semibold text-sm">
                              {responseMessage.plan.message}
                            </Text>
                          ) : (
                            <Text className="text-red-600 font-semibold text-sm">
                              {responseMessage.plan.message}
                            </Text>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            loading={responseLoading}
                            onClick={() =>
                              notes && notes.length >= 4
                                ? handlePlan()
                                : setResponseMessage({
                                    ...responseMessage,
                                    plan: {
                                      message: "Catatan minimal 4 karakter",
                                      success: false,
                                    },
                                  })
                            }
                            type="submit"
                          >
                            Rencanakan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setNotes(null);
                            setSelectedImages([]);
                          }}
                          disabled={
                            (!isLoading &&
                              data.status.id === Status.COMPLETE) ||
                            !data.isVerified
                          }
                          variant="primary"
                          size="xs"
                          color="indigo"
                        >
                          Proses
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Proses usulan</DialogTitle>
                          <DialogDescription>
                            Lampirkan catatan dan foto untuk meyakinkan
                            pengguna!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="mx-auto w-full">
                            <label
                              htmlFor="bukti-foto-tolak"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Tambahkan Bukti Foto (opsional)
                            </label>
                            <input
                              required
                              onChange={handleFileChange}
                              id="bukti-foto-tolak"
                              type="file"
                              multiple
                              accept="image/jpg, image/png, image/jpeg"
                              className="cursor-pointer file:cursor-pointer block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60 file:bg-tremor-brand/50"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Hanya gambar dengan format .jpg/.jpeg/.png.
                            </p>
                          </div>

                          <TextInput
                            minLength={4}
                            required
                            onChange={(val) => setNotes(val.target.value)}
                            icon={ReaderIcon}
                            placeholder="Masukkan Catatan"
                            className="mb-2"
                          />
                          {responseMessage.process.message &&
                          responseMessage.process.success ? (
                            <Text className="text-tremor-brand font-semibold text-sm">
                              {responseMessage.process.message}
                            </Text>
                          ) : (
                            <Text className="text-red-600 font-semibold text-sm">
                              {responseMessage.process.message}
                            </Text>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            loading={responseLoading}
                            onClick={() =>
                              notes && notes.length >= 4
                                ? handleProcess()
                                : setResponseMessage({
                                    ...responseMessage,
                                    process: {
                                      message: "Catatan minimal 4 karakter",
                                      success: false,
                                    },
                                  })
                            }
                            type="submit"
                          >
                            Proses
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setNotes(null);
                            setSelectedImages([]);
                          }}
                          disabled={
                            !isLoading && data.status.id !== Status.PROCESS
                          }
                          variant="primary"
                          size="xs"
                        >
                          Selesai
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Selesaikan usulan</DialogTitle>
                          <DialogDescription>
                            Lampirkan catatan dan foto untuk meyakinkan
                            pengguna!
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="mx-auto w-full">
                            <label
                              htmlFor="bukti-foto-selesai"
                              className="mb-1 block text-sm font-medium text-gray-700"
                            >
                              Tambahkan Bukti Foto
                            </label>
                            <input
                              required
                              onChange={handleFileChange}
                              id="bukti-foto-selesai"
                              type="file"
                              multiple
                              accept="image/jpg, image/png, image/jpeg"
                              className="cursor-pointer file:cursor-pointer block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-500 file:py-2.5 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60 file:bg-tremor-brand/50"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Hanya gambar dengan format .jpg/.jpeg/.png.
                            </p>
                          </div>

                          <TextInput
                            minLength={4}
                            required
                            onChange={(val) => setNotes(val.target.value)}
                            icon={ReaderIcon}
                            placeholder="Masukkan Catatan"
                            className="mb-2"
                          />
                          {responseMessage.complete.message &&
                          responseMessage.complete.success ? (
                            <Text className="text-tremor-brand font-semibold text-sm">
                              {responseMessage.complete.message}
                            </Text>
                          ) : (
                            <Text className="text-red-600 font-semibold text-sm">
                              {responseMessage.complete.message}
                            </Text>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            loading={responseLoading}
                            onClick={() =>
                              notes && notes.length >= 4
                                ? selectedImages.length < 1
                                  ? setResponseMessage({
                                      ...responseMessage,
                                      complete: {
                                        message: "Foto bukti harus diisi!",
                                        success: false,
                                      },
                                    })
                                  : handleComplete()
                                : setResponseMessage({
                                    ...responseMessage,
                                    complete: {
                                      message: "Catatan minimal 4 karakter",
                                      success: false,
                                    },
                                  })
                            }
                            type="submit"
                          >
                            Selesaikan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Flex>
                  <Subtitle className="mt-8 mb-4">
                    <Bold>Teruskan</Bold>
                  </Subtitle>
                  <TextInput
                    minLength={4}
                    onChange={(val) => setNotes(val.target.value)}
                    icon={ReaderIcon}
                    placeholder="Masukkan Catatan"
                    className="mb-2"
                  />
                  <Flex className="gap-3">
                    <SearchSelect
                      onChange={(val) => setOfficer(val)}
                      title="Pilih Petugas"
                      placeholder="Pilih petugas"
                    >
                      {!isLoading ? (
                        officers.map((officer) => (
                          <SearchSelectItem key={officer.id} value={officer.id}>
                            {officer.name}
                          </SearchSelectItem>
                        ))
                      ) : (
                        <SearchSelectItem value="loading">
                          Loading...
                        </SearchSelectItem>
                      )}
                    </SearchSelect>
                    <Button
                      onClick={() =>
                        notes && notes.length >= 4
                          ? handleForward()
                          : setResponseMessage({
                              ...responseMessage,
                              forward: {
                                message: "Catatan minimal 4 karakter",
                                success: false,
                              },
                            })
                      }
                      loading={responseLoading}
                      disabled={
                        (!isLoading && officer === null) ||
                        data.status.id === Status.COMPLETE
                      }
                      variant="primary"
                      color="neutral"
                      size="sm"
                    >
                      Teruskan
                    </Button>
                  </Flex>
                  {responseMessage.forward.message &&
                  responseMessage.forward.success ? (
                    <Text className="text-tremor-brand font-semibold text-sm">
                      {responseMessage.forward.message}
                    </Text>
                  ) : (
                    <Text className="text-red-600 font-semibold text-sm">
                      {responseMessage.forward.message}
                    </Text>
                  )}
                </Card>
                <Card className="mb-24 md:mb-0">
                  <Title className="mb-6 pb-4 border-b">
                    <Bold>Timeline Status Usulan</Bold>
                  </Title>
                  {status.length > 0 ? (
                    <ol className="relative border-l border-gray-200 dark:border-gray-700">
                      {status.map((item, index) => (
                        <li className="mb-10 ml-4" key={index}>
                          <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                          <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            {new Date(item.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            {item.descripiton}
                          </p>
                          {item.images.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <img
                                  src={item.images[0].path}
                                  className="w-[60px] aspect-[1/1] rounded-lg object-cover cursor-pointer"
                                />
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Foto Bukti</DialogTitle>
                                  <DialogDescription>
                                    Foto bukti status usulan.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center space-x-2">
                                  {item.images.length > 1 ? (
                                    <img
                                      src={
                                        item.images
                                          ? item.images[statusSelectedImage]
                                              .path
                                          : "null"
                                      }
                                      placeholder=""
                                      className="max-h-[360px] aspect-[3/4] rounded-lg mb-4 object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        item.images
                                          ? item.images[0].path
                                          : "null"
                                      }
                                      placeholder=""
                                      className="max-h-[360px] aspect-[3/4] rounded-lg mb-4 object-cover"
                                    />
                                  )}
                                  <div className="flex flex-row justify-start gap-2">
                                    {item.images.map((image, index) => (
                                      <img
                                        key={index}
                                        onClick={() =>
                                          setStatusSelectedImage(index)
                                        }
                                        src={image.path}
                                        className={`w-[60px] aspect-[1/1] rounded-lg object-cover cursor-pointer ${
                                          statusSelectedImage === index &&
                                          "border-2 border-tremor-brand"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : null}
                          {item.notes && (
                            <div className="p-2 border rounded-lg inline-flex gap-2 items-center mt-2">
                              <ReaderIcon width={30} />
                              <p className="text-sm">{item.notes}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Skeleton className="w-full" height={100} />
                  )}
                </Card>
              </Col>
            </Grid>
          )}
        </main>
      </Container>
    </>
  );
};

export default SuggestionDetails;
