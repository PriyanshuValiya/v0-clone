"use client";

import React, { useContext, useEffect, useRef } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { ActionContext } from "@/context/actionContext";

function SandpackPreviewClient() {
  const previewRef = useRef();
  const { sandpack } = useSandpack();
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    const getClient = async () => {
      const client = previewRef.current?.getClient();

      if (client) {
        const result = await client.getCodeSandboxURL();

        if (action?.actionType == "deploy") {
          window.open(`${result?.sandboxId}.csb.app`);
        } else if (action?.actionType == "export") {
          window.open(result?.editorUrl);
        }
      }
    };

    getClient();
  }, [sandpack && action]);

  return (
    <div>
      <SandpackPreview
        ref={previewRef}
        style={{ height: "78vh", width: "970px" }}
        showNavigator={true}
        showOpenInCodeSandbox={true}
      />
    </div>
  );
}

export default SandpackPreviewClient;
