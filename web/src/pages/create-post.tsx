import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = () => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  useIsAuth();

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
