import Button from "@/components/Button/Button";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import { Form, Formik } from "formik";

export default function ProfileNotifications() {
  return (
    <Formik
      initialValues={{
        emailAlert: false,
        smsAlert: false,
      }}
      onSubmit={(values, { resetForm }) => {
        console.log("Form Submitted ✅", values);

        // After submitting, reset initialValues to new state
        resetForm({ values });
      }}
    >
      {({ values, setFieldValue, isSubmitting, initialValues }) => {
        const hasChanges =
          values.emailAlert !== initialValues.emailAlert ||
          values.smsAlert !== initialValues.smsAlert;

        return (
          <Form className="space-y-6">
            <div className="md:text-[28px] text-[20px] leading-[120%] tracking-[-2%] py-6 font-semibold text-gray-700 border-b-[0.2px] border-gray-400">
              Notification & Preference
            </div>

            <div className="text-[16px] leading-[145%] text-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[16px] leading-[145%] text-gray-700">
                  Email Alert
                </p>
                <CustomSwitch
                  checked={values.emailAlert}
                  onChange={(val) => setFieldValue("emailAlert", val)}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[16px] leading-[145%] text-gray-700">
                  SMS Alert
                </p>
                <CustomSwitch
                  checked={values.smsAlert}
                  onChange={(val) => setFieldValue("smsAlert", val)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={!hasChanges || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
