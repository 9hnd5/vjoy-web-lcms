import { createContext, useCallback, useContext, useMemo } from "react";

export const AssignmentsContext = createContext({});

export const useAssignedBalloons = (id: string) => {
  const ctx = useContext(AssignmentsContext);

  return useMemo(() => {
    if (!ctx) {
      return [];
    }

    const balloonIds = [];

    for (const [balloonId, boardId] of Object.entries(ctx)) {
      if (boardId === id) {
        balloonIds.push(balloonId);
      }
    }

    return balloonIds;
  }, [ctx, id]);
};

export const useAssignedIdCount = () => {
  const ctx = useContext(AssignmentsContext);

  return useCallback(
    (id: string) => {
      let count = 0;
      for (const [balloonId] of Object.entries(ctx)) {
        if (balloonId.startsWith(id)) {
          count += 1;
        }
      }
      return count;
    },
    [ctx]
  );
};
