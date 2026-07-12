import { PictRunner } from "@takeyaqa/pict-wasm";
import { useEffect, useRef, useState } from "react";

function usePictRunner(pictRunnerInjection?: PictRunner) {
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false);
  const pictRunner = useRef<PictRunner>(null);

  useEffect(() => {
    // Use the injected PictRunner for testing
    if (pictRunnerInjection) {
      pictRunner.current = pictRunnerInjection;
      setPictRunnerLoaded(true);
      return;
    }
    const loadPictRunner = async () => {
      pictRunner.current = await PictRunner.create();
      setPictRunnerLoaded(true);
    };

    // oxlint-disable-next-line no-floating-promises
    loadPictRunner();
  }, [pictRunnerInjection]);

  return { pictRunner, pictRunnerLoaded };
}

export default usePictRunner;
