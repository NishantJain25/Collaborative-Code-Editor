import React from "react";

function OutputDetails({ outputDetails }) {
  console.log(outputDetails);
  return (
    <div className="mt-4 flex-col space-y-3 w-full">
      <p>Status: 
        <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
            {outputDetails?.status?.description}
        </span>
      </p>
      <p>Memory: 
      <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
            {outputDetails?.memory}
        </span>
      </p>
      <p>Time: 
      <span className="font-semibold px-2 py-1 rounded-md bg-gray-100">
            {outputDetails?.time}
        </span>
      </p>
    </div>
  );
}

export default OutputDetails;
