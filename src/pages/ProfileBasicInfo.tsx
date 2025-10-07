import { useProfileHook } from "@/hooks";

export default function ProfileBasicInfo() {
  const { profileData, isLoading, getRoleDisplayName, getIDField, getIDLabel } =
    useProfileHook();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:text-[28px] text-[20px] leading-[120%] tracking-[-2%] py-6 font-semibold text-gray-700 border-b-[0.2px] border-gray-400">
        Basic Information
      </div>

      {/* Personal Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <p className="text-gray-900">{`${profileData.firstName} ${profileData.lastName}`}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Role
            </label>
            <p className="text-gray-900">{getRoleDisplayName()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {getIDLabel()}
            </label>
            <p className="text-gray-900">{getIDField()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <p className="text-gray-900">{profileData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number
            </label>
            <p className="text-gray-900">{profileData.phoneNumber}</p>
          </div>
          {profileData.gender && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gender
              </label>
              <p className="text-gray-900 capitalize">{profileData.gender}</p>
            </div>
          )}
          {profileData.dateOfBirth && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Date of Birth
              </label>
              <p className="text-gray-900">
                {new Date(profileData.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Address Information Card */}
      {(profileData.residentialAddress ||
        profileData.stateOfResidence ||
        profileData.lgaOfResidence) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.residentialAddress && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Residential Address
                </label>
                <p className="text-gray-900">
                  {profileData.residentialAddress}
                </p>
              </div>
            )}
            {profileData.stateOfResidence && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  State of Residence
                </label>
                <p className="text-gray-900">{profileData.stateOfResidence}</p>
              </div>
            )}
            {profileData.lgaOfResidence && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  LGA of Residence
                </label>
                <p className="text-gray-900">{profileData.lgaOfResidence}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banking Information Card */}
      {(profileData.bankName || profileData.bankAccount) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Banking Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.bankName && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bank Name
                </label>
                <p className="text-gray-900">{profileData.bankName}</p>
              </div>
            )}
            {profileData.bankAccount && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bank Account
                </label>
                <p className="text-gray-900">{profileData.bankAccount}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Employment Information Card */}
      {(profileData.employmentType ||
        profileData.dateOfEmployment ||
        profileData.status) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Employment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.employmentType && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Employment Type
                </label>
                <p className="text-gray-900 capitalize">
                  {profileData.employmentType}
                </p>
              </div>
            )}
            {profileData.dateOfEmployment && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date of Employment
                </label>
                <p className="text-gray-900">
                  {new Date(profileData.dateOfEmployment).toLocaleDateString()}
                </p>
              </div>
            )}
            {profileData.status && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    profileData.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {profileData.status.charAt(0).toUpperCase() +
                    profileData.status.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents Card */}
      {(profileData.validNIN ||
        profileData.utilityBill ||
        profileData.passport ||
        profileData.employmentLetter) && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileData.validNIN && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Valid NIN
                </label>
                <a
                  href={profileData.validNIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline"
                >
                  View NIN Document
                </a>
              </div>
            )}
            {profileData.utilityBill && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Utility Bill
                </label>
                <a
                  href={profileData.utilityBill}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline"
                >
                  View Utility Bill
                </a>
              </div>
            )}
            {profileData.passport && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Passport
                </label>
                <a
                  href={profileData.passport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline"
                >
                  View Passport
                </a>
              </div>
            )}
            {profileData.employmentLetter && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Employment Letter
                </label>
                <a
                  href={profileData.employmentLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark underline"
                >
                  View Employment Letter
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
