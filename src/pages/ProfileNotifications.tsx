import Button from "@/components/Button/Button";
import TextInput from "@/components/TextInput/TextInput";
import { Switch } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";

export default function ProfileNotifications() {
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      //   validationSchema={SecuritySchema}
      onSubmit={(values) => {
        console.log("Form Submitted ✅", values);
      }}
    >
      {({ resetForm }) => (
        <Form className="space-y-4">
          <div className="md:text-[28px] text-[20px] leading-[120%] tracking-[-2%] py-6 font-semibold text-gray-700">
            Notification & Preference
          </div>

          <div className="text-[16px] leading-[145%] text-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <p>Email Alert</p>
              <Switch className="w-[39px] h-6" />
            </div>

            <div className="flex items-center justify-between">
              <p>SMS Alert</p>
              <Switch className="w-[39px] h-6" />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
