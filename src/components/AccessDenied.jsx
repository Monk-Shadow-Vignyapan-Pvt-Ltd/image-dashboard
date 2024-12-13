import React from "react";

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-100 bg-cardBg card-shadow rounded-lg">
      <div className="max-w-md p-6 text-center bg-white rounded-lg">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 11l3.172-3.172a4 4 0 10-5.656-5.656L8.172 5.828M8 16h.01M15.657 15.657a8 8 0 11-11.314 0M15 19h5m0 0v-5m0 5l-5-5"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Access Denied
        </h1>
        <p className="mb-4 text-gray-600">
          You don't have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 font-semibold text-white bg-accent rounded hover:bg-accent/80 duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
