import React, { useState } from "react";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={toggleDrawer}
        className="p-2 text-white bg-blue-500 rounded"
      >
        Open Drawer
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">Drawer Navigation</h2>
          <button
            onClick={toggleDrawer}
            className="mt-4 text-red-500 underline"
          >
            Close Drawer
          </button>
        </div>
        <ul className="mt-6 space-y-4">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Link 1
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Link 2
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Link 3
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
