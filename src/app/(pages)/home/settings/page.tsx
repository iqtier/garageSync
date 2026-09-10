import { getBusinessById } from "@/app/actions/settingActions";
import { auth } from "@/lib/auth";
import { User } from "@/types/type";
import Image from "next/image";
import Link from "next/link"; // Import Link

import React from "react";

const Page = async () => {
  const session = await auth();
  const user = session?.user as User;
  const businessDetails = await getBusinessById(user?.business_Id as string);

  if (!businessDetails) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No business details found.
        </p>
      </div>
    );
  }

  const address = businessDetails.address as {
    state: string;
    postal: string;
    country: string;
    roadname: string;
    city: string;
  };

  return (
    <div className="bg-white dark:bg-gray-900 items-center flex flex-col p-6 rounded-lg shadow-md transition-colors duration-300">
      <div>
        <div className="text-2xl font-bold  text-gray-900 dark:text-gray-100 mb-4">
          {businessDetails.name}
        </div>
      </div>
      <div className="space-y-4">
        {businessDetails.logo && (
          <div className="flex items-center justify-center">
            <Image
              src={`data:image/png;base64,${Buffer.from(
                businessDetails.logo
              ).toString("base64")}`}
              alt="Business Logo"
              width={100}
              height={100}
              className="rounded-full shadow-md object-cover"
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <strong className="text-gray-700 dark:text-gray-300">Phone:</strong>
          <p className="text-gray-700 dark:text-gray-300">{businessDetails.phone}</p>
          
        </div>
        <div className="flex items-center space-x-2">
        <strong className="text-gray-700 dark:text-gray-300">Email:</strong>
        <p className="text-gray-700 dark:text-gray-300">{businessDetails.email}</p>
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            Address:
          </p>
          <ul className="text-gray-700 dark:text-gray-300 pl-4 list-disc">
            <li>
              <strong className="font-medium">Road:</strong> {address.roadname}
            </li>
            <li>
              <strong className="font-medium">State:</strong> {address.state}
            </li>
            <li>
              <strong className="font-medium">City:</strong> {address.city}
            </li>
            <li>
              <strong className="font-medium">Postal Code:</strong> {address.postal}
            </li>
            <li>
              <strong className="font-medium">Country:</strong> {address.country}
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <strong className="text-gray-700 dark:text-gray-300">Tax Rate:</strong>
          <p className="text-gray-700 dark:text-gray-300">{businessDetails.taxRate * 100} %</p>
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6">
        <Link href={`/settings/business/edit/${user?.business_Id}`} legacyBehavior>
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-800">
            Update Business Details
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Page;