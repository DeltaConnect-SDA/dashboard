import { Container } from "@/components";
import Navbar from "@/components/Navbar";
import { APP_NAME } from "@/config/config";
import { Colors } from "@/constants/colors";
import {
  Badge,
  Button,
  Card,
  Flex,
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
  Title,
} from "@tremor/react";
import React, { useEffect, useState } from "react";
import Helemet from "react-helmet";
import TimeAgo from "react-timeago";
import idStrings from "react-timeago/lib/language-strings/id";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { publicAPI } from "@/api/backend";
import Skeleton from "react-loading-skeleton";
import { Status } from "@/constants/status";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const formatter = buildFormatter(idStrings);

function Suggestion() {
  const [categories, setCategories] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [priorities, setPriorities] = useState(null);
  const [prioritiesLoading, setPrioritiesLoading] = useState(true);
  const [statuses, setStatuses] = useState(null);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [category, setCategory] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [orderBy, setOrderBy] = useState("desc");
  const [query, setQuery] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{ data: any; meta: any }>();

  const getCategories = async () => {
    try {
      const response = await publicAPI.get("categories");
      const { data } = response.data;
      setCategories(data);
      console.log(data, "categories");

      setCategoriesLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Error(err);
    }
  };

  const getPriorities = async () => {
    try {
      const response = await publicAPI.get("priorities");
      const { data } = response.data;
      setPriorities(data);
      console.log(data, "priorities");

      setPrioritiesLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Response(err, { status: err.response.status });
    }
  };

  const getStatuses = async () => {
    try {
      const response = await publicAPI.get("statuses");
      const { data } = response.data;
      console.log(data, "statuses");

      setStatuses(data);

      setStatusesLoading(false);
    } catch (err) {
      // setIsLoading(false);
      console.error(err);
      throw new Response(err, { status: err.response.status });
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        page,
        perPage,
        orderByDate: orderBy,
        status: status.join(",") || null,
        query: query,
        category: category.join(",") || null,
        priority: priority.join(",") || null,
      };
      console.log(params);

      const response = await publicAPI.get("suggestions/search/dashboard", {
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

  useEffect(() => {
    // handleData();
    handleSearch();
    getCategories();
    getPriorities();
    getStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page || perPage) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  const renderTable = () => {
    return (
      <Table className="mt-6 rounded-md">
        <TableHead className="divide-tremor-border border">
          <TableRow className="rounded-lg">
            <TableHeaderCell>Nomor Referensi</TableHeaderCell>
            <TableHeaderCell>Judul</TableHeaderCell>
            <TableHeaderCell>Total Pendukung</TableHeaderCell>
            <TableHeaderCell>Katgori</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Prioritas</TableHeaderCell>
            <TableHeaderCell>Waktu</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody className="divide-tremor-border border">
          {!isLoading
            ? data.data.map((item) => (
                <TableRow key={item.ref_id}>
                  <TableCell>{item.ref_id}</TableCell>
                  <TableCell className="truncate max-w-xs 2xl:max-w-none">
                    {item.title}
                  </TableCell>
                  <TableCell>{item.upVoteTotal}</TableCell>
                  <TableCell>{item.category.title}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          item.status.id === Status.WAITING
                            ? Colors.SECONDARY_ORANGE
                            : item.status.id === Status.VERIFICATION ||
                              item.status.id === Status.PROCESS
                            ? Colors.SECONDARY_TOSCA
                            : item.status.id === Status.CANCELED ||
                              item.status.id === Status.DECLINED
                            ? Colors.SECONDARY_RED
                            : Colors.SECONDARY_GREEN,

                        color:
                          item.status.id === Status.WAITING
                            ? Colors.PRIMARY_ORANGE
                            : item.status.id === Status.VERIFICATION ||
                              item.status.id === Status.PROCESS
                            ? Colors.PRIMARY_TOSCA
                            : item.status.id === Status.CANCELED ||
                              item.status.id === Status.DECLINED
                            ? Colors.PRIMARY_RED
                            : Colors.PRIMARY_GREEN,
                      }}
                    >
                      {item.status.title}
                    </Badge>
                  </TableCell>
                  <TableCell
                    style={{
                      color:
                        item.priority.id === 1
                          ? Colors.PRIMARY_RED
                          : item.priority.id === 2
                          ? Colors.PRIMARY_ORANGE
                          : Colors.PRIMARY_YELLOW,
                    }}
                  >
                    {item.priority.title}
                  </TableCell>
                  <TableCell>
                    <TimeAgo date={item.createdAt} formatter={formatter} />
                  </TableCell>
                  <TableCell>
                    <Link to={`/usulan/${item.id}`}>
                      <Button
                        variant="secondary"
                        color="zinc"
                        icon={MixerHorizontalIcon}
                        size="xs"
                      >
                        Lihat Detail
                      </Button>
                    </Link>
                  </TableCell>
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
        {isLoading ? (
          <Skeleton width={100} />
        ) : (
          <div className="flex justify-center">
            <nav aria-label="Pagination">
              <ul className="inline-flex items-center -space-x-px rounded-md text-sm shadow-sm">
                <>
                  <li>
                    <span
                      onClick={
                        !isLoading && data.meta.currentPage !== 1
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
                        !isLoading && data.meta.currentPage !== 1
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
        <title>{`Usulan | ${APP_NAME}`}</title>
      </Helemet>
      <Navbar />
      <Container>
        <Title className="font-bold text-2xl text-black">Usulan Pengguna</Title>
        <div className="mt-6">
          <Card>
            <Flex justifyContent="start" className="gap-5 flex-col lg:flex-row">
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
              <MultiSelect
                onValueChange={(status) => setStatus(status)}
                placeholder="Pilih Status"
                // className="max-w-[100px]"
              >
                {!statusesLoading
                  ? statuses.map((status) => (
                      <MultiSelectItem key={status.title} value={status.id}>
                        {status.title}
                      </MultiSelectItem>
                    ))
                  : null}
              </MultiSelect>
              <MultiSelect
                onValueChange={(priority) => setPriority(priority)}
                placeholder="Pilih Prioritas"
                // className="max-w-[100px]"
              >
                {!prioritiesLoading
                  ? priorities.map((priority) => (
                      <MultiSelectItem key={priority.title} value={priority.id}>
                        {priority.title}
                      </MultiSelectItem>
                    ))
                  : null}
              </MultiSelect>
              <MultiSelect
                onValueChange={(category) => setCategory(category)}
                placeholder="Pilih Kategori"
                // className="max-w-[100px]"
              >
                {!categoriesLoading
                  ? categories.map((category) => (
                      <MultiSelectItem key={category.title} value={category.id}>
                        {category.title}
                      </MultiSelectItem>
                    ))
                  : null}
              </MultiSelect>
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
                        <g fillRule="nonzero" transform="translate(-768 -96)">
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
                        <g fillRule="nonzero" transform="translate(-720 -96)">
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
                  handleSearch();
                }}
                className="w-max"
              >
                Cari Laporan
              </Button>
            </Flex>
            {renderTable()}
            <Flex className="mt-5" justifyContent="between">
              {!isLoading ? (
                <Text>
                  Halaman {!isLoading ? data.meta.currentPage : "loading"} dari{" "}
                  {!isLoading ? data.meta.lastPage : "loading"}
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
        </div>
      </Container>
    </>
  );
}

export default Suggestion;
