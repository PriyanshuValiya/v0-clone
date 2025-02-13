"use client";

import React, { useContext, useState, useEffect } from "react";
import Image from "next/image";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageContext } from "@/context/messageContext";
import { supabase } from "@/utils/supabase";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { Button } from "./ui/button";
import { Cloud, ExpandIcon } from "lucide-react";
import { ActionContext } from "@/context/actionContext";

const imgsrc =
  "https://i.pinimg.com/originals/dd/67/4f/dd674f89d713bb2645a3292510219998.gif";

const dependencies = {
  postcss: "^8",
  tailwindcss: "^3.4.1",
  autoprefixer: "^10.0.0",
  uuid4: "^2.0.3",
  "tailwind-merge": "^2.4.0",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "^0.469.0",
  "react-router-dom": "^7.1.1",
  "@google/generative-ai": "^0.21.0",
  "date-fns": "^4.1.0",
  "react-chartjs-2": "^5.3.0",
  "chart.js": "^4.4.7",
};

const demofiles = {
  "/public/index.html": {
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  },
  "/App.css": {
    code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  },
  "/tailwind.config.js": {
    code: `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
}`,
  },
  "/postcss.config.js": {
    code: `/** @type {import('postcss-load-config').Config} */
const config = {
plugins: {
  tailwindcss: {},
 },
};

export default config;
`,
  },
  "/src/index.js": {
    code: `
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
    `,
  },
  "/src/App.js": {
    code: `
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Hello, Sandpack!</h1>
    </div>
  );
}

export default App;
    `,
  },
};

const codePrompt = `
Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, 
without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.
also you can use date-fns for date format and react-chartjs-2 chart, graph library

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}

Here’s the reformatted and improved version of your prompt:

Generate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.

Return the response in JSON format with the following schema:

json
Copy code
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}
Ensure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:
files:{
  "/App.js": {
    "code": "import React from 'react';\nimport './styles.css';\nexport default function App() {\n  return (\n    <div className='p-4 bg-gray-100 text-center'>\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\n    </div>\n  );\n}"
  }
}
  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.
  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,"firebase","@google/generative-ai" ) only when it required
  
  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg
  -Add Emoji icons whenever needed to give good user experinence
  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

- Use icons from lucide-react for logos.

- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.
`;

function CodeView({ id }) {
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(demofiles);
  const [load, setLoad] = useState(false);
  const { messages, setMessages } = useContext(MessageContext);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1]?.role;

      if (role === "user") {
        generateCode();
      }
    }
  }, [messages]);

  useEffect(() => {
    const getFiles = async () => {
      setLoad(true);

      try {
        const { data, error } = await supabase
          .from("workspace")
          .select("file_data")
          .eq("id", id);

        if (error) {
          console.error("Error while uploading files:", error);
          return;
        }

        setFiles({ ...demofiles, ...JSON.parse(data[0].file_data) });
      } catch (err) {
        console.error("Error while fetching files:", err);
      } finally {
        setLoad(false);
      }
    };

    getFiles();
  }, [id]);

  const generateCode = async () => {
    setLoad(true);
    const res = await fetch("/api/gen-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: PROMPT }),
    });

    const data = await res.json();

    const aiResp = data;
    const mergedFiles = { ...demofiles, ...aiResp?.files };

    setFiles(mergedFiles);
    uploadFiles(mergedFiles);
    setLoad(false);
  };

  const uploadFiles = async (file) => {
    // console.log("Start Saving Files");

    try {
      const { error } = await supabase
        .from("workspace")
        .update({ file_data: JSON.stringify(file) })
        .eq("id", id);

      if (error) {
        console.error("Error while uploading files:", error);
        return;
      }

      console.log("Files uploaded successfully...");
    } catch (error) {
      console.error("Error while uploading files:", error);
    }
  };

  const onAction = (actiontype) => {
    setAction({
      actionType: actiontype,
      timeStamp: Date.now()
    });
  };

  return (
    <div className="relative">
      <div className="flex justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="border-2 border-gray-600 rounded-xl px-1">
          <Button variant="ghost" onClick={() => onAction("export")}>
            <ExpandIcon />
          </Button>
          <Button variant="ghost" onClick={() => onAction("deploy")}>
            <Cloud />
          </Button>
        </div>
      </div>

      <SandpackProvider
        className="mt-2"
        template="react"
        files={files}
        theme={"dark"}
        customSetup={{ dependencies }}
        options={{ externalResources: ["https://cdn.tailwindcss.com"] }}
      >
        <SandpackLayout className="mt-2">
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "78vh" }} />
              <SandpackCodeEditor style={{ height: "78vh" }} />
            </>
          ) : (
            <SandpackPreviewClient />
          )}
        </SandpackLayout>
      </SandpackProvider>

      {load && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <div className="flex items-center bg-white rounded-xl py-2 px-5">
            <Image src={imgsrc} alt="Load Image" height={150} width={100} />
            <h2 className="text-2xl text-black font-sans">Wait a moment...</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeView;
