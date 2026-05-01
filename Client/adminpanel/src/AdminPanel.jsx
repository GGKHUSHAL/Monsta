import React, { useState } from "react";
import { Link } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";

export default function AdminPanelLayout({ children }) {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-900 text-white p-5 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <ul className="space-y-3">
          {adminRoutes.map((item, index) => (
            <div key={index}>

              {/* Dashboard Direct Link */}
              {item.name === "Dashboard" ? (
                <Link to="/">
                  <li className="p-3 bg-gray-800 rounded cursor-pointer hover:bg-gray-700">
                    Dashboard
                  </li>
                </Link>
              ) : (
                <>
                  <li
                    onClick={() =>
                      setOpenMenu(openMenu === index ? null : index)
                    }
                    className="p-3 bg-gray-800 rounded cursor-pointer hover:bg-gray-700 flex justify-between"
                  >
                    {item.name}
                    <span>{openMenu === index ? "▲" : "▼"}</span>
                  </li>

                  {openMenu === index && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.routes
                        .filter((route) => !route.path.includes(":"))
                        .map((route) => {
                          const actionLabel = route.path.includes("/add")
                            ? "Add"
                            : "View";

                          return (
                            <Link key={route.path} to={route.path}>
                              <li className="p-2 bg-gray-800 rounded cursor-pointer">
                                {actionLabel} {item.name}
                              </li>
                            </Link>
                          );
                        })}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
