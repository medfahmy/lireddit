import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Stack, Tag, Text } from "@chakra-ui/react";

interface Props {}

const Index: React.FC<Props> = () => {
  const [variables, setVariables] = useState({
    limit: 33,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading>lireddit</Heading>

        <NextLink href="/create-post">
          <Button ml="auto" color="blue">
            create post
          </Button>
        </NextLink>
      </Flex>

      <br />

      {fetching && !data ? (
        <Tag>loading...</Tag>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <NextLink href={`/user/${p.creatorID}`}>
                <Button size="small" fontSize="xl">
                  {p.creatorID}
                </Button>
              </NextLink>
              <Text mt={4}>
                {p.textSnippet}
                <NextLink href={`/post/${p.id}`}>
                  <Button size="small"> ...</Button>
                </NextLink>
              </Text>
            </Box>
          ))}
        </Stack>
      )}

      {data && data.posts.hasMore && (
        <Flex>
          <Button
            isLoading={fetching}
            m="auto"
            my={8}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
