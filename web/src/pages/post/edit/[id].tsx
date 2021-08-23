import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useGetPostFromUrl } from "../../../hooks/useGetPostFromUrl";
import { createUrqlClient } from "../../../utils/createUrqlClient";

const EditPost: React.FC = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  if (fetching) {
    return <div>loading...</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          // const { error } = await createPost({ input: values });
          // if (!error) {
          //   router.push("/");
          // }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="title"
              placeholder="title"
              autoFocus
            />

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
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
