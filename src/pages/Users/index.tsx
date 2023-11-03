import { Container } from "@/components";
import Navbar from "@/components/Navbar";
import { APP_NAME } from "@/config/config";
import { Colors } from "@/constants/colors";
import {
  Badge,
  Button,
  Card,
  Flex,
  Select,
  SelectItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
  Title,
  SearchSelect,
  SearchSelectItem,
} from "@tremor/react";
import React, { useEffect, useState } from "react";
import Helemet from "react-helmet";
import TimeAgo from "react-timeago";
import idStrings from "react-timeago/lib/language-strings/id";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { publicAPI } from "@/api/backend";
import Skeleton from "react-loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useAuth } from "@/context/AuthProvider";
import Roles from "@/config/Roles";

const formatter = buildFormatter(idStrings);

const Users = () => {
  const [orderBy, setOrderBy] = useState("desc");
  const [query, setQuery] = useState(null);
  const [roleQuery, setRoleQuery] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{ data: any; meta: any }>({
    data: null,
    meta: null,
  });
  const [roles, setRoles] = useState<{ data: any; meta: any }>({
    data: null,
    meta: null,
  });
  const [role, setRole] = useState("public");
  const [addOfficerData, setAddOfficerData] = useState<{
    firstName: string | null;
    LastName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    roleId: string | null;
  }>({
    firstName: null,
    LastName: null,
    email: null,
    phone: null,
    password: null,
    roleId: null,
  });

  const [addOfficerError, setAddOfficerError] = useState<{
    firstName: string | null;
    LastName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    role: string | null;
  }>({
    firstName: null,
    LastName: null,
    email: null,
    phone: null,
    password: null,
    role: null,
  });

  const [addOfficerLoading, setAddOfficerLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<{
    addOfficer: {
      success: boolean | null;
      message: string | null;
    };
    addRole: {
      success: boolean | null;
      message: string | null;
    };
  }>({
    addOfficer: {
      success: null,
      message: null,
    },
    addRole: {
      success: null,
      message: null,
    },
  });
  const { authState } = useAuth();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        perPage,
        orderByDate: orderBy,
        query: query,
      };
      console.log(params);

      const response = await publicAPI.get("v1/users/search", {
        params,
      });
      const { data } = response.data;
      setData(data);
      console.log(data);

      setIsLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Response(err, { status: err.response.status });
    }
  };

  const handleRolesSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        perPage,
        orderByDate: orderBy,
        query: roleQuery,
      };
      console.log(params);

      const response = await publicAPI.get("v1/users/roles/search", {
        params,
      });
      const { data } = response.data;
      setRoles(data);
      console.log(data);

      setIsLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Response(err, { status: err.response.status });
    }
  };

  const handleOfficerSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        perPage,
        orderByDate: orderBy,
        query: query,
      };
      console.log(params);

      const response = await publicAPI.get("v1/users/officers/search", {
        params,
      });
      const { data } = response.data;
      setData(data);
      console.log(data);

      setIsLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Response(err, { status: err.response.status });
    }
  };

  const validateAddOfficer = () => {
    let valid = true;
    if (!addOfficerData.firstName) {
      valid = false;
      handleAddOfficerError("Nama depan harus diisi!", "firstName");
    } else if (addOfficerData.firstName.length < 4) {
      valid = false;
      handleAddOfficerError("Nama depan minimal 4 karakter!", "firstName");
    }

    if (!addOfficerData.LastName) {
      valid = false;
      handleAddOfficerError("Nama belakang harus diisi!", "LastName");
    } else if (addOfficerData.LastName.length < 4) {
      valid = false;
      handleAddOfficerError("Nama belakang minimal 4 karakter!", "LastName");
    }

    if (!addOfficerData.email) {
      valid = false;
      handleAddOfficerError("Email harus diisi!", "email");
    }

    if (!addOfficerData.phone) {
      valid = false;
      handleAddOfficerError("Nomor HP harus diisi!", "phone");
    } else {
      setAddOfficerData({
        ...addOfficerData,
        phone: filterPhoneNumber(addOfficerData.phone),
      });
    }

    if (!addOfficerData.password) {
      valid = false;
      handleAddOfficerError("Password harus diisi!", "password");
    } else if (addOfficerData.password.length < 8) {
      valid = false;
      handleAddOfficerError("Password minimal 8 karakter!", "password");
    } else if (addOfficerData.password.length > 32) {
      valid = false;
      handleAddOfficerError("Password maksimal 32 karakter!", "password");
    }

    if (!addOfficerData.roleId) {
      valid = false;
      handleAddOfficerError("Role harus diisi!", "roleId");
    }

    if (valid) {
      handleAddOfficer();
    }
  };

  const handleAddOfficer = async () => {
    setAddOfficerLoading(true);
    try {
      const response = await publicAPI.post(`v1/users/officers`, {
        ...addOfficerData,
      });
      const { success } = response.data;
      console.log(response.data);

      if (success) {
        setResponseMessage({
          ...responseMessage,
          addOfficer: {
            success: true,
            message: "Petugas telah ditambahkan.",
          },
        });
        setTimeout(() => location.reload(), 1000);
      } else {
        setResponseMessage({
          ...responseMessage,
          addOfficer: {
            success: false,
            message: "Petugas gagal ditambahkan.",
          },
        });
      }
      setAddOfficerLoading(false);
    } catch (err) {
      if (err.response.status === 400) {
        err.response.data.message.map((err) => {
          return handleAddOfficerError(err.error[0], err.field);
        });
      }
      setAddOfficerLoading(false);
      console.error(err);
      setResponseMessage({
        ...responseMessage,
        addOfficer: {
          success: false,
          message: "Petugas gagal ditambahkan.",
        },
      });
    }
  };

  const handleAddOfficerError = (errMessage, input) => {
    setAddOfficerError((prevState) => ({
      ...prevState,
      [input]: errMessage,
    }));
  };

  const filterPhoneNumber = (phoneNumber) => {
    // Menghilangkan spasi dan karakter non-digit dari nomor telepon
    phoneNumber = phoneNumber.replace(/\D/g, "");

    // Jika nomor diawali dengan '0', hapus '0' dan tambahkan '62'
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.slice(1);
    }

    // Jika nomor diawali dengan '+', hilangkan '+'
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1);
    }

    // Jika nomor tidak diawali dengan '62', tambahkan '62'
    if (!phoneNumber.startsWith("62")) {
      phoneNumber = "62" + phoneNumber;
    }

    return phoneNumber;
  };

  useEffect(() => {
    handleSearch();
    if (authState.role === Roles.SUPER_ADMIN) handleRolesSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page || perPage) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  useEffect(() => {
    if (role === "public") handleSearch();
    else if (role === "offcier") handleOfficerSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const renderTable = () => {
    return (
      <Table className="mt-6 rounded-md">
        <TableHead className="divide-tremor-border border">
          <TableRow className="rounded-lg">
            <TableHeaderCell>Nama Depan</TableHeaderCell>
            <TableHeaderCell>Nama Belakang</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Nomor HP</TableHeaderCell>
            {role === "public" && (
              <TableHeaderCell>Terverifikasi</TableHeaderCell>
            )}
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Tanggal Daftar</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="divide-tremor-border border">
          {!isLoading && data.data
            ? data.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.firstName}</TableCell>
                  <TableCell>{item.LastName}</TableCell>
                  <TableCell className="truncate max-w-[200px] 2xl:max-w-none">
                    {item.email}
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>
                  {role === "public" && (
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: item.UserDetail.isVerified
                            ? Colors.SECONDARY_GREEN
                            : Colors.SECONDARY_RED,

                          color: item.UserDetail.isVerified
                            ? Colors.PRIMARY_GREEN
                            : Colors.PRIMARY_RED,
                        }}
                      >
                        {item.UserDetail.isVerified
                          ? "Terverifikasi"
                          : "Belum Verifikasi"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="truncate max-w-[200px] 2xl:max-w-none">
                    {item.role.name}
                  </TableCell>
                  <TableCell>
                    <TimeAgo date={item.createdAt} formatter={formatter} />
                  </TableCell>
                  {/* <TableCell>
                    <Link to={`/pengguna/${item.id}`}>
                      <Button
                        variant="secondary"
                        color="zinc"
                        icon={MixerHorizontalIcon}
                        size="xs"
                      >
                        Lihat Detail
                      </Button>
                    </Link>
                  </TableCell> */}
                </TableRow>
              ))
            : [...Array(10)].map((x, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        stroke="none"
                        strokeWidth="1"
                      >
                        <g fillRule="nonzero" transform="translate(-96 -288)">
                          <g transform="translate(96 288)">
                            <path
                              fillRule="nonzero"
                              d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                            ></path>
                            <path
                              fill="currentColor"
                              d="M6 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    );
  };

  const renderRoleTable = () => {
    return (
      <Table className="mt-6 rounded-md">
        <TableHead className="divide-tremor-border border">
          <TableRow className="rounded-lg">
            <TableHeaderCell>Tipe</TableHeaderCell>
            <TableHeaderCell>Nama</TableHeaderCell>
            <TableHeaderCell>Deskripsi</TableHeaderCell>
            <TableHeaderCell>Jumlah Pengguna</TableHeaderCell>
            <TableHeaderCell>Jumlah Laporan Ditugaskan</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="divide-tremor-border border">
          {!isLoading && roles.data
            ? roles.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="truncate max-w-[200px] 2xl:max-w-none">
                    {item.name}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] 2xl:max-w-none">
                    {item.description}
                  </TableCell>
                  <TableCell>{item._count.User}</TableCell>
                  <TableCell>{item._count.assignedComplaint}</TableCell>
                  {/* <TableCell>
                    <Link to={`/pengguna/${item.id}`}>
                      <Button
                        variant="secondary"
                        color="zinc"
                        icon={MixerHorizontalIcon}
                        size="xs"
                      >
                        Lihat Detail
                      </Button>
                    </Link>
                  </TableCell> */}
                </TableRow>
              ))
            : [...Array(10)].map((x, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        stroke="none"
                        strokeWidth="1"
                      >
                        <g fillRule="nonzero" transform="translate(-96 -288)">
                          <g transform="translate(96 288)">
                            <path
                              fillRule="nonzero"
                              d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                            ></path>
                            <path
                              fill="currentColor"
                              d="M6 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    );
  };

  const renderPagination = () => {
    return (
      <>
        {(isLoading && !data.data) || !roles.data ? (
          <Skeleton width={100} />
        ) : (
          <div className="flex justify-center">
            <nav aria-label="Pagination">
              <ul className="inline-flex items-center -space-x-px rounded-md text-sm shadow-sm">
                <>
                  <li>
                    <span
                      onClick={
                        !isLoading && data.meta && data.meta.currentPage !== 1
                          ? () => {
                              setPage(1);
                            }
                          : () => console.log("last")
                      }
                      className="cursor-pointer inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <Text>Pertama</Text>
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={
                        !isLoading && data.meta && data.meta.currentPage !== 1
                          ? () => {
                              setPage(data.meta.currentPage - 1);
                            }
                          : () => console.log("before")
                      }
                      className="cursor-pointer inline-flex items-center border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={
                        !isLoading &&
                        data.meta &&
                        data.meta.currentPage !== data.meta.lastPage
                          ? () => {
                              setPage(data.meta.currentPage + 1);
                            }
                          : () => console.log("next")
                      }
                      className="cursor-pointer inline-flex items-center border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      onClick={
                        !isLoading &&
                        data.meta &&
                        data.meta.currentPage !== data.meta.lastPage
                          ? () => {
                              setPage(data.meta.lastPage);
                            }
                          : () => console.log("last")
                      }
                      className="cursor-pointer inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <Text>Terakhir</Text>
                    </span>
                  </li>
                </>
              </ul>
            </nav>
          </div>
        )}
      </>
    );
  };
  return (
    <>
      <Helemet>
        <title>{`Pengguna | ${APP_NAME}`}</title>
      </Helemet>
      <Navbar />
      <Container>
        <Title className="font-bold text-2xl text-black">Pengguna</Title>
        <div className="mt-6">
          <TabGroup>
            <TabList>
              <Tab>Pengguna</Tab>
              {authState.role === Roles.SUPER_ADMIN && <Tab>Role</Tab>}
              <Tab>Permintaan Verifikasi</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Card className="mt-6">
                  <Flex
                    justifyContent="start"
                    className="gap-5 flex-col lg:flex-row"
                  >
                    <TextInput
                      onChange={(e) => setQuery(e.target.value)}
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 ml-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      type="text"
                      placeholder="Search..."
                    />
                    <Select
                      onValueChange={(order) => setOrderBy(order)}
                      placeholder="Urutkan Berdasarkan"
                      defaultValue="desc"
                    >
                      <SelectItem
                        defaultChecked
                        value="desc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-768 -96)"
                              >
                                <g transform="translate(768 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M18 4a1 1 0 011 1v12.414l1.121-1.121a1 1 0 011.415 1.414l-2.829 2.828a1 1 0 01-1.414 0l-2.829-2.828a1 1 0 111.415-1.414L17 17.414V5a1 1 0 011-1zm-7 14a1 1 0 01.117 1.993L11 20H4a1 1 0 01-.117-1.993L4 18h7zm2-7a1 1 0 01.117 1.993L13 13H4a1 1 0 01-.117-1.993L4 11h9zm0-7a1 1 0 110 2H4a1 1 0 010-2h9z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terbaru
                      </SelectItem>
                      <SelectItem
                        value="asc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-720 -96)"
                              >
                                <g transform="translate(720 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M17.293 3.465a1 1 0 011.32-.084l.094.084 2.828 2.828a1 1 0 01-1.32 1.497l-.094-.083L19 6.586V19a1 1 0 01-1.993.117L17 19V6.586l-1.121 1.121a1 1 0 01-1.498-1.32l.083-.094 2.829-2.828zM13 18a1 1 0 01.117 1.993L13 20H4a1 1 0 01-.117-1.993L4 18h9zm0-7a1 1 0 110 2H4a1 1 0 110-2h9zm-2-7a1 1 0 110 2H4a1 1 0 110-2h7z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terlama
                      </SelectItem>
                    </Select>
                    <Select
                      onValueChange={(role) => setRole(role)}
                      placeholder="Urutkan Berdasarkan"
                      defaultValue="public"
                    >
                      <SelectItem defaultChecked value="public">
                        Masyarakat
                      </SelectItem>
                      <SelectItem value="offcier">Petugas</SelectItem>
                    </Select>
                    <Button
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      onClick={() => {
                        setPage(1);
                        if (role === "public") {
                          handleSearch();
                        } else {
                          handleOfficerSearch();
                        }
                      }}
                      className="w-max"
                    >
                      Cari Pengguna
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          icon={() => (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              className="h-4 w-4 mr-3"
                            >
                              <g
                                fill="none"
                                fillRule="evenodd"
                                stroke="none"
                                strokeWidth="1"
                              >
                                <g transform="translate(-672)">
                                  <g transform="translate(672)">
                                    <path
                                      fillRule="nonzero"
                                      d="M24 0v24H0V0h24zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018zm.264-.113l-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092z"
                                    ></path>
                                    <path
                                      fill="currentColor"
                                      d="M11 2a5 5 0 100 10 5 5 0 000-10zM8 7a3 3 0 116 0 3 3 0 01-6 0zM4 18.5c0-.18.09-.489.413-.899.316-.4.804-.828 1.451-1.222C7.157 15.589 8.977 15 11 15c.375 0 .744.02 1.105.059a1 1 0 10.211-1.99C11.887 13.025 11.447 13 11 13c-2.395 0-4.575.694-6.178 1.671-.8.49-1.484 1.065-1.978 1.69C2.358 16.977 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22l.685-.005a1 1 0 10-.027-2L11 20c-2.19 0-4.083-.143-5.4-.492-.663-.175-1.096-.382-1.345-.582C4.037 18.751 4 18.622 4 18.5zM18 14a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2v-2a1 1 0 011-1z"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          )}
                          className="w-max"
                        >
                          Tambahkan Petugas
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] mb-32 mt-32">
                        <DialogHeader>
                          <DialogTitle>Tambahkan Petugas</DialogTitle>
                          <DialogDescription>
                            Menambahkan petugas baru.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Nama Depan
                          </label>
                          <TextInput
                            onChange={(e) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                firstName: e.target.value,
                              })
                            }
                            errorMessage={addOfficerError.firstName}
                            error={addOfficerError.firstName && true}
                            onFocus={() =>
                              setAddOfficerError({
                                ...addOfficerError,
                                firstName: null,
                              })
                            }
                            value={addOfficerData.firstName}
                            name="firstName"
                            placeholder="Masukkan Nama Depan"
                            required
                          />
                          <label
                            htmlFor="LastName"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Nama Belakang
                          </label>
                          <TextInput
                            onChange={(e) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                LastName: e.target.value,
                              })
                            }
                            errorMessage={addOfficerError.LastName}
                            error={addOfficerError.LastName && true}
                            onFocus={() =>
                              setAddOfficerError({
                                ...addOfficerError,
                                LastName: null,
                              })
                            }
                            value={addOfficerData.LastName}
                            name="LastName"
                            placeholder="Masukkan Nama Belakang"
                            required
                          />
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Email
                          </label>
                          <TextInput
                            onChange={(e) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                email: e.target.value,
                              })
                            }
                            errorMessage={addOfficerError.email}
                            error={addOfficerError.email && true}
                            onFocus={() =>
                              setAddOfficerError({
                                ...addOfficerError,
                                email: null,
                              })
                            }
                            value={addOfficerData.email}
                            name="email"
                            placeholder="Masukkan Email"
                            type="email"
                            required
                          />
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Nomor Telepon
                          </label>
                          <TextInput
                            onChange={(e) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                phone: e.target.value,
                              })
                            }
                            errorMessage={addOfficerError.phone}
                            error={addOfficerError.phone && true}
                            onFocus={() =>
                              setAddOfficerError({
                                ...addOfficerError,
                                phone: null,
                              })
                            }
                            value={addOfficerData.phone}
                            name="phone"
                            placeholder="contoh: 628742827473"
                            required
                          />
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Password
                          </label>
                          <TextInput
                            onChange={(e) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                password: e.target.value,
                              })
                            }
                            errorMessage={addOfficerError.password}
                            error={addOfficerError.password && true}
                            onFocus={() =>
                              setAddOfficerError({
                                ...addOfficerError,
                                password: null,
                              })
                            }
                            value={addOfficerData.password}
                            name="password"
                            placeholder="Masukkan Password"
                            type="password"
                            required
                          />
                          <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
                          >
                            Role
                          </label>
                          <SearchSelect
                            onValueChange={(val) =>
                              setAddOfficerData({
                                ...addOfficerData,
                                roleId: val,
                              })
                            }
                            placeholder="Pilih Role"
                          >
                            {!isLoading && roles.data ? (
                              roles.data.map((role) => (
                                <SearchSelectItem value={role.id} key={role.id}>
                                  {role.name}
                                </SearchSelectItem>
                              ))
                            ) : (
                              <SearchSelectItem value="loading">
                                Loading....
                              </SearchSelectItem>
                            )}
                          </SearchSelect>
                          {addOfficerError.role && (
                            <Text className="text-red-600 font-semibold text-sm">
                              {addOfficerError.role}
                            </Text>
                          )}
                        </div>
                        {responseMessage.addOfficer.message &&
                        responseMessage.addOfficer.success ? (
                          <Text className="text-tremor-brand font-semibold text-sm">
                            {responseMessage.addOfficer.message}
                          </Text>
                        ) : (
                          <Text className="text-red-600 font-semibold text-sm">
                            {responseMessage.addOfficer.message}
                          </Text>
                        )}
                        <DialogFooter>
                          <Button
                            loading={addOfficerLoading}
                            onClick={() => validateAddOfficer()}
                            variant="primary"
                          >
                            Tambahkan
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </Flex>
                  {renderTable()}
                  <Flex className="mt-5" justifyContent="between">
                    {!isLoading && data.meta ? (
                      <Text>
                        Halaman{" "}
                        {!isLoading && data.meta
                          ? data.meta.currentPage
                          : "loading"}{" "}
                        dari{" "}
                        {!isLoading && data.meta
                          ? data.meta.lastPage
                          : "loading"}
                      </Text>
                    ) : (
                      <Skeleton width={100} />
                    )}
                    <div className="lg:inline-flex gap-3">
                      <Select
                        onValueChange={(perPage) => {
                          setPerPage(+perPage);
                        }}
                        placeholder="Row per page"
                        className="max-w-[50px]"
                      >
                        <SelectItem defaultChecked value="10">
                          10
                        </SelectItem>
                        <SelectItem defaultChecked value="50">
                          50
                        </SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </Select>
                      {renderPagination()}
                    </div>
                  </Flex>
                </Card>
              </TabPanel>

              <TabPanel>
                <Card className="mt-6">
                  <Flex
                    justifyContent="start"
                    className="gap-5 flex-col lg:flex-row"
                  >
                    <TextInput
                      onChange={(e) => setRoleQuery(e.target.value)}
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 ml-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      type="text"
                      placeholder="Search..."
                    />
                    <Select
                      onValueChange={(order) => setOrderBy(order)}
                      placeholder="Urutkan Berdasarkan"
                      defaultValue="desc"
                    >
                      <SelectItem
                        defaultChecked
                        value="desc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-768 -96)"
                              >
                                <g transform="translate(768 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M18 4a1 1 0 011 1v12.414l1.121-1.121a1 1 0 011.415 1.414l-2.829 2.828a1 1 0 01-1.414 0l-2.829-2.828a1 1 0 111.415-1.414L17 17.414V5a1 1 0 011-1zm-7 14a1 1 0 01.117 1.993L11 20H4a1 1 0 01-.117-1.993L4 18h7zm2-7a1 1 0 01.117 1.993L13 13H4a1 1 0 01-.117-1.993L4 11h9zm0-7a1 1 0 110 2H4a1 1 0 010-2h9z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terbaru
                      </SelectItem>
                      <SelectItem
                        value="asc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-720 -96)"
                              >
                                <g transform="translate(720 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M17.293 3.465a1 1 0 011.32-.084l.094.084 2.828 2.828a1 1 0 01-1.32 1.497l-.094-.083L19 6.586V19a1 1 0 01-1.993.117L17 19V6.586l-1.121 1.121a1 1 0 01-1.498-1.32l.083-.094 2.829-2.828zM13 18a1 1 0 01.117 1.993L13 20H4a1 1 0 01-.117-1.993L4 18h9zm0-7a1 1 0 110 2H4a1 1 0 110-2h9zm-2-7a1 1 0 110 2H4a1 1 0 110-2h7z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terlama
                      </SelectItem>
                    </Select>
                    <Button
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      onClick={() => {
                        setPage(1);
                        handleRolesSearch();
                      }}
                      className="w-max"
                    >
                      Cari Role
                    </Button>
                  </Flex>
                  {renderRoleTable()}
                  <Flex className="mt-5" justifyContent="between">
                    {!isLoading && data.meta ? (
                      <Text>
                        Halaman{" "}
                        {!isLoading && data.meta
                          ? data.meta.currentPage
                          : "loading"}{" "}
                        dari{" "}
                        {!isLoading && data.meta
                          ? data.meta.lastPage
                          : "loading"}
                      </Text>
                    ) : (
                      <Skeleton width={100} />
                    )}
                    <div className="lg:inline-flex gap-3">
                      <Select
                        onValueChange={(perPage) => {
                          setPerPage(+perPage);
                        }}
                        placeholder="Row per page"
                        className="max-w-[50px]"
                      >
                        <SelectItem defaultChecked value="10">
                          10
                        </SelectItem>
                        <SelectItem defaultChecked value="50">
                          50
                        </SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </Select>
                      {renderPagination()}
                    </div>
                  </Flex>
                </Card>
              </TabPanel>
              <TabPanel>
                <Card className="mt-6">
                  <Flex
                    justifyContent="start"
                    className="gap-5 flex-col lg:flex-row"
                  >
                    <TextInput
                      onChange={(e) => setRoleQuery(e.target.value)}
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 ml-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      type="text"
                      placeholder="Search..."
                    />
                    <Select
                      onValueChange={(order) => setOrderBy(order)}
                      placeholder="Urutkan Berdasarkan"
                      defaultValue="desc"
                    >
                      <SelectItem
                        defaultChecked
                        value="desc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-768 -96)"
                              >
                                <g transform="translate(768 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M18 4a1 1 0 011 1v12.414l1.121-1.121a1 1 0 011.415 1.414l-2.829 2.828a1 1 0 01-1.414 0l-2.829-2.828a1 1 0 111.415-1.414L17 17.414V5a1 1 0 011-1zm-7 14a1 1 0 01.117 1.993L11 20H4a1 1 0 01-.117-1.993L4 18h7zm2-7a1 1 0 01.117 1.993L13 13H4a1 1 0 01-.117-1.993L4 11h9zm0-7a1 1 0 110 2H4a1 1 0 010-2h9z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terbaru
                      </SelectItem>
                      <SelectItem
                        value="asc"
                        icon={() => (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-3"
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
                                transform="translate(-720 -96)"
                              >
                                <g transform="translate(720 96)">
                                  <path
                                    fillRule="nonzero"
                                    d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                  ></path>
                                  <path
                                    fill="currentColor"
                                    d="M17.293 3.465a1 1 0 011.32-.084l.094.084 2.828 2.828a1 1 0 01-1.32 1.497l-.094-.083L19 6.586V19a1 1 0 01-1.993.117L17 19V6.586l-1.121 1.121a1 1 0 01-1.498-1.32l.083-.094 2.829-2.828zM13 18a1 1 0 01.117 1.993L13 20H4a1 1 0 01-.117-1.993L4 18h9zm0-7a1 1 0 110 2H4a1 1 0 110-2h9zm-2-7a1 1 0 110 2H4a1 1 0 110-2h7z"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        )}
                      >
                        Terlama
                      </SelectItem>
                    </Select>
                    <Button
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-240 -288)">
                              <g transform="translate(240 288)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-7a7 7 0 104.192 12.606l5.1 5.101a1 1 0 001.415-1.414l-5.1-5.1A7 7 0 0010 3z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      onClick={() => {
                        setPage(1);
                        handleRolesSearch();
                      }}
                      className="w-max"
                    >
                      Cari Role
                    </Button>
                    <Button
                      icon={() => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="h-4 w-4 mr-3"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="none"
                            strokeWidth="1"
                          >
                            <g transform="translate(-672)">
                              <g transform="translate(672)">
                                <path
                                  fillRule="nonzero"
                                  d="M24 0v24H0V0h24zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018zm.264-.113l-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M11 2a5 5 0 100 10 5 5 0 000-10zM8 7a3 3 0 116 0 3 3 0 01-6 0zM4 18.5c0-.18.09-.489.413-.899.316-.4.804-.828 1.451-1.222C7.157 15.589 8.977 15 11 15c.375 0 .744.02 1.105.059a1 1 0 10.211-1.99C11.887 13.025 11.447 13 11 13c-2.395 0-4.575.694-6.178 1.671-.8.49-1.484 1.065-1.978 1.69C2.358 16.977 2 17.713 2 18.5c0 .845.411 1.511 1.003 1.986.56.45 1.299.748 2.084.956C6.665 21.859 8.771 22 11 22l.685-.005a1 1 0 10-.027-2L11 20c-2.19 0-4.083-.143-5.4-.492-.663-.175-1.096-.382-1.345-.582C4.037 18.751 4 18.622 4 18.5zM18 14a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2v-2a1 1 0 011-1z"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      )}
                      className="w-max"
                    >
                      Tambahkan Role
                    </Button>
                  </Flex>
                  {renderRoleTable()}
                  <Flex className="mt-5" justifyContent="between">
                    {!isLoading && data.meta ? (
                      <Text>
                        Halaman{" "}
                        {!isLoading && data.meta
                          ? data.meta.currentPage
                          : "loading"}{" "}
                        dari{" "}
                        {!isLoading && data.meta
                          ? data.meta.lastPage
                          : "loading"}
                      </Text>
                    ) : (
                      <Skeleton width={100} />
                    )}
                    <div className="lg:inline-flex gap-3">
                      <Select
                        onValueChange={(perPage) => {
                          setPerPage(+perPage);
                        }}
                        placeholder="Row per page"
                        className="max-w-[50px]"
                      >
                        <SelectItem defaultChecked value="10">
                          10
                        </SelectItem>
                        <SelectItem defaultChecked value="50">
                          50
                        </SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </Select>
                      {renderPagination()}
                    </div>
                  </Flex>
                </Card>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </Container>
    </>
  );
};

export default Users;
