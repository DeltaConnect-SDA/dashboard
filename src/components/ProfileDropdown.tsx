import { authAPI } from "@/api/backend";
import { useAuth } from "@/context/AuthProvider";
import { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

function ProfileDropdown(props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const handleFocusIn = (event: { target: any }) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  const toggle = () => {
    if (!isOpen) {
      open();
    } else {
      close();
      buttonRef.current.focus();
    }
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    authAPI.get("/logout").then(() => {
      logout();
      navigate("/login", { replace: true });
    });
  };

  return (
    <div className="flex justify-center">
      <div
        className={`relative inline-block ${isOpen ? "open" : ""}`}
        ref={panelRef}
      >
        {/* Button */}
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          aria-controls="dropdown-panel"
          type="button"
          ref={buttonRef}
        >
          <div className="relative h-10 w-10">
            <Avatar
              email="yukebrilliant@gmail.com"
              size="40"
              name="Yuke Brilliant"
              round
            />
          </div>
        </button>

        {/* Panel */}
        {isOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-60 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white text-left text-sm shadow-lg"
            id="dropdown-panel"
          >
            {/* Panel content */}
            <div className="py-3 px-4 w-[240px]">
              <div className="flex items-center gap-3 truncate">
                <div className="relative h-10 w-10">
                  <Avatar
                    email="yukebrilliant@gmail.com"
                    size="40"
                    name="Yuke Brilliant"
                    round
                  />
                  <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-700">
                    {props.loading ? (
                      <Skeleton width={50} />
                    ) : (
                      props.data.firstName + " " + props.data.LastName
                    )}
                  </div>
                  <p className="text-gray-400 w-full line-clamp-1 truncate">
                    {props.loading ? (
                      <Skeleton width={50} />
                    ) : (
                      props.data.role.name
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-1">
              <a
                href="#"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
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
                View profile
                <span className="inline-flex flex-1 justify-end gap-1 text-xs capitalize text-gray-400">
                  <kbd className="min-w-[1em] font-sans">⌥</kbd>
                  <kbd className="min-w-[1em] font-sans">⇧</kbd>
                  <kbd className="min-w-[1em] font-sans">P</kbd>
                </span>
              </a>
            </div>
            <div className="p-1">
              <button
                onClick={() => handleLogout()}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-red-600 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                  >
                    <g fillRule="nonzero" transform="translate(-672 -96)">
                      <g transform="translate(672 96)">
                        <path
                          fillRule="nonzero"
                          d="M24 0v24H0V0h24zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018zm.265-.113l-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022zm-.715.002a.023.023 0 00-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M12 3a1 1 0 01.117 1.993L12 5H7a1 1 0 00-.993.883L6 6v12a1 1 0 00.883.993L7 19h4.5a1 1 0 01.117 1.993L11.5 21H7a3 3 0 01-2.995-2.824L4 18V6a3 3 0 012.824-2.995L7 3h5zm5.707 5.464l2.828 2.829a1 1 0 010 1.414l-2.828 2.829a1 1 0 11-1.414-1.415L17.414 13H12a1 1 0 110-2h5.414l-1.121-1.121a1 1 0 011.414-1.415z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
                Log out
                <span className="inline-flex flex-1 justify-end gap-1 text-xs capitalize text-gray-400">
                  <kbd className="min-w-[1em] font-sans">ctrl</kbd>+
                  <kbd className="min-w-[1em] font-sans">alt</kbd>+
                  <kbd className="min-w-[1em] font-sans">L</kbd>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileDropdown;
