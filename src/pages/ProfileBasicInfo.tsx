import { Formik, Form } from "formik";
import TextInput from "@/components/TextInput/TextInput";

export default function ProfileBasicInfo() {
  return (
    <Formik
      initialValues={{
        fullName: "David Imasuen", // just an example default
        role: "Credit Agent", // just an example default
        agentId: "#AG001", // just an example default
        email: "David.Imasuen@AsaVictory.com", // just an example default
        number: "09123456789", // just an example default
      }}
      onSubmit={(values) => console.log(values)}
    >
      {() => (
        <Form className="space-y-4">
          <div className="md:text-[28px] text-[20px] leading-[120%] tracking-[-2%] py-6 font-semibold text-gray-700">
            Basic Information
          </div>

          <TextInput name="fullName" type="text" label="Full name" disabled />
          <TextInput name="role" type="text" label="Role" disabled />
          <TextInput name="agentId" type="text" label="Agent ID" disabled />
          <TextInput name="email" type="text" label="Email Address" disabled />
          <TextInput name="number" type="text" label="Phone Number" disabled />
        </Form>
      )}
    </Formik>
  );
}
