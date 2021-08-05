import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<"up" | "down" | "not">(
    "not"
  );

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={5}>
      <IconButton
        onClick={async () => {
          setLoadingState("up");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not");
        }}
        isLoading={loadingState === "up"}
        aria-label="upvote"
        icon={<ChevronUpIcon />}
      />

      {post.points}

      <IconButton
        onClick={async () => {
          setLoadingState("down");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not");
        }}
        isLoading={loadingState === "down"}
        aria-label="downvote"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
