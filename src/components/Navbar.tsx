import { NavLink, json } from "react-router-dom";
import Logo from "@/assets/Logo.svg";
import ProfileDropdown from "./ProfileDropdown";
import React, { useEffect, useState } from "react";
import { publicAPI } from "@/api/backend";
import { ROLE_KEY, useAuth } from "@/context/AuthProvider";
import Roles from "@/config/Roles";

const Navbar = () => {
  const [data, setData] = useState({});
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const handleProfile = async () => {
    try {
      const response = await publicAPI.get("v1/auth/profile");
      const data = response.data;

      setData(data);
      localStorage.setItem(ROLE_KEY, data.role.type);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // setLoading(false);
      throw json(
        {
          error,
        },
        {
          status: error.response.status,
        }
      );
    }
  };

  useEffect(() => {
    handleProfile();
  }, []);

  return (
    <header
      className={`fixed z-50 left-0 bottom-0 lg:left-auto lg:bottom-auto lg:static lg:flex items-center w-full bg-white border-b overflow-x-scroll lg:overflow-visible`}
    >
      <div className="container px-4 lg:px-8 mx-auto">
        <div className="relative flex items-center justify-between -mx-4">
          <div className="hidden lg:block max-w-full px-4">
            <a href="/#" className="block py-5">
              <img src={Logo} alt="logo" />
            </a>
          </div>
          <div className="flex items-center justify-between w-full px-4">
            <nav
              className={`lg:hidden w-full rounded-lg bg-white py-5 lg:w-full lg:max-w-full lg:shadow-none`}
            >
              <ul className="flex justify-center gap-6">
                <ListItem title="Dashboard" to="/dashboard" />
                <ListItem title="Laporan" to="/laporan" />
                <ListItem title="Usulan" to="/usulan" />
                {authState.role === Roles.SUPER_ADMIN ||
                authState.role === Roles.AUTHORIZER ? (
                  <>
                    <ListItem title="Pengguna" to="/pengguna" />
                    <ListItem title="Informasi" to="/informasi" />
                  </>
                ) : null}
              </ul>
            </nav>
            <nav
              className={`absolute right-4 top-full w-full rounded-lg bg-white py-5 shadow lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none`}
            >
              <ul className="flex gap-6">
                <ListItem title="Dashboard" to="/dashboard" />
                <ListItem title="Laporan" to="/laporan" />
                <ListItem title="Usulan" to="/usulan" />
                {authState.role === Roles.SUPER_ADMIN ||
                authState.role === Roles.AUTHORIZER ? (
                  <>
                    <ListItem title="Pengguna" to="/pengguna" />
                    <ListItem title="Informasi" to="/informasi" />
                  </>
                ) : null}
              </ul>
            </nav>
            <div className="hidden lg:flex justify-end">
              <ProfileDropdown loading={loading} data={data} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const ListItem: React.FC<any> = ({ title, to, icon }) => {
  return (
    <>
      <li>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `flex text-base font-medium ${isActive ? "text-tremor-brand" : ""}`
          }
        >
          {icon} {title}
        </NavLink>
      </li>
    </>
  );
};
