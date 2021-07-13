import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePost: React.FC<{}> = () => {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { error } = await createPost({ input: values });
          console.log(error);
          if (error?.message.includes("not authenticated")) {
            router.push("/login");
          } else {
          }
          router.push("/");
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
