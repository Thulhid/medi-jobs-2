"use client";

import { useParams } from "next/navigation";
import { useGetUserRequestById } from "@/modules/backend/user-request/hooks/use-gey-by-id-user-reques";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

export const UserRequestDetail = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id) || "";
  const { userRequest, userRequestLoading } = useGetUserRequestById(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomTableBackHeader header="user-requests" link="true" />
        <h1 className="text-3xl font-bold text-black">User Request Details</h1>
        <p className="text-gray-600">
          View the full details of a user request.
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {userRequestLoading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : !userRequest ? (
          <div className="text-sm text-rose-600">Request not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500">Name</div>
              <div className="text-base font-medium">
                {userRequest.firstname} {userRequest.lastname}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="text-base">{userRequest.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Mobile</div>
              <div className="text-base">{userRequest.contact}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Designation</div>
              <div className="text-base">{userRequest.designation}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Hospital</div>
              <div className="text-base">{userRequest.hospital}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Created At</div>
              <div className="text-base">
                {new Date(userRequest.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Message</div>
              <div className="text-base whitespace-pre-wrap rounded mt-2">
                {userRequest.message || "-"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
