import React from "react";
import NextLink from "next/link";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface Props {
  id: number;
  creatorId: number;
}

export const EditDeletePost: React.FC<Props> = ({ id, creatorId }) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={2}
          icon={<EditIcon />}
          aria-label="edit post"
        />
      </NextLink>

      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete post"
        onClick={() => {
          deletePost({ id });
        }}
      />
    </Box>
  );
};
