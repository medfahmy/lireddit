import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import router from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";

interface Props {
  token: string;
}

const ChangePassword: NextPage<Props> = ({ token }) => {
  return (
    <>
      <div style={{ textAlign: "center", padding: "20px" }}>
        token : {token}
      </div>
      <Wrapper variant="small">
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            // const response = await login(values);
            // if (response.data?.login.errors) {
            //   setErrors(toErrorMap(response.data.login.errors));
            // } else if (response.data?.login.user) {
            //   router.push("/");
            // }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                label="new password"
                placeholder="new password"
              />

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="orange"
              >
                change password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
