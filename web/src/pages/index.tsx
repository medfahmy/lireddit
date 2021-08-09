import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import {
  Link,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Tag,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
import { UpdootSection } from "../components/UpdootSection";

function Index() {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>query failed for some reason</div>;
  }

  return (
    <Layout>
      {fetching && !data ? (
        <Tag>loading...</Tag>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <NextLink href={`/user/${p.creator.username}`}>
                    <Link fontSize="medium">
                      posted by {p.creator.username}
                    </Link>
                  </NextLink>
                  <Flex align="center">
                    <Text mt={4}>{p.textSnippet}</Text>
                    <IconButton
                      ml="auto"
                      icon={<DeleteIcon />}
                      aria-label="delete post"
                      onClick={() => {
                        deletePost({ id: p.id });
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}

      {data && data.posts.hasMore ? (
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
      ) : null}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
