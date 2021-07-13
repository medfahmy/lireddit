import React from "react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";

import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="username or email"
              placeholder="username or email"
            />

            <Box mt={4}>
              <InputField
                name="password"
                label="password"
                placeholder="password"
                type="password"
              />
            </Box>

            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="orange"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
