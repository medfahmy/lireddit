import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = () => {
  const [{ data, fetching }] = useMeQuery();
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router]);

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="title" placeholder="title" />

            <Box mt={4}>
              <InputField
                textarea
                name="text"
                label="body"
                placeholder="text..."
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="orange"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

// export default CreatePost;
export default withUrqlClient(createUrqlClient)(CreatePost);
