// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Message } from "./Message";
// import { MessageInput } from "./MessageInput";
// import { ChatProps } from "./types";
// import { Card } from "@/components/ui/card";
// import {
//   sendChatMessage,
//   addUserMessage,
// } from "@/app/redux/features/chatboatSlice";
// import { useAppDispatch } from "@/app/redux/redux/hooks";
// import { useSelector } from "react-redux";

// export function Chat({
//   className = "",
//   placeholder = "Type your message...",
//   welcomeMessage = "Hi! I'm your AI assistant. How can I help you today?",
// }: ChatProps) {
//   const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Get Redux state
//   const {
//     messages,
//     chatErrorMessage,
//     isChatError,
//     isChatLoading,
//     isChatSuccess,
//   } = useSelector((state: any) => state.chat);

//   const dispatch = useAppDispatch();

//   // Initialize with welcome message only once
//   useEffect(() => {
//     if (!hasWelcomeMessage && messages.length === 0) {
//       const welcomeMsg = {
//         id: "welcome-" + Date.now(),
//         content: welcomeMessage,
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       // Don't use addUserMessage for welcome message, it should be a bot message
//       // You might want to create an addBotMessage action or handle this differently
//       setHasWelcomeMessage(true);
//     }
//   }, [welcomeMessage, messages.length, hasWelcomeMessage, dispatch]);

//   // Auto-scroll to bottom when new messages are added
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async (content: string) => {
//     // Add user message to Redux store
//     dispatch(addUserMessage(content));

//     // Send message to API and get bot response
//     dispatch(sendChatMessage({ msg: content }));
//   };

//   // Transform Redux messages to component format
//   const transformedMessages = messages.map((msg: any) => {
//     // Handle different content formats
//     let displayContent;
//     let fullResponseData;

//     if (msg.sender === "user") {
//       // User messages should always have string content
//       displayContent = msg.content;
//       fullResponseData = undefined;
//     } else if (msg.sender === "bot") {
//       // Bot messages might have string or object content
//       if (typeof msg.content === "string") {
//         displayContent = msg.content;
//         fullResponseData = msg.fullResponse;
//       } else if (typeof msg.content === "object" && msg.content.response) {
//         displayContent = msg.content.response;
//         fullResponseData = msg.content; // The whole object is the full response
//       } else {
//         displayContent = "Error: Invalid message format";
//         fullResponseData = msg.content;
//       }
//     }

//     return {
//       id: msg.id,
//       content: displayContent,
//       sender: msg.sender,
//       timestamp: new Date(msg.timestamp),
//       fullResponse: fullResponseData,
//     };
//   });

//   return (
//     <Card className={`flex flex-col h-[600px] ${className}`}>
//       {/* Chat Header */}
//       <div className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-lg">
//         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//           <span className="text-white text-sm font-medium">AI</span>
//         </div>
//         <div>
//           <h3 className="font-semibold text-gray-900">AI Assistant</h3>
//           <p className="text-sm text-gray-500">
//             {isChatLoading ? "Typing..." : "Online"}
//           </p>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {transformedMessages.map((message: any) => (
//           <Message key={message.id} message={message} />
//         ))}

//         {/* Loading/Typing indicator */}
//         {isChatLoading && (
//           <div className="flex gap-3 mb-4">
//             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <span className="text-gray-600 text-xs">AI</span>
//             </div>
//             <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
//               <div className="flex gap-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.1s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error message display */}
//         {isChatError && (
//           <div className="flex gap-3 mb-4">
//             <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs">!</span>
//             </div>
//             <div className="bg-red-100 border border-red-300 rounded-2xl rounded-bl-md px-4 py-2">
//               <p className="text-red-700 text-sm">
//                 Error: {chatErrorMessage || "Something went wrong"}
//               </p>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-4 border-t bg-white rounded-b-lg">
//         <MessageInput
//           onSendMessage={handleSendMessage}
//           placeholder={placeholder}
//           disabled={isChatLoading}
//         />
//       </div>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { ChatProps } from "./types";
import { Card } from "@/components/ui/card";
import {
  sendChatMessage,
  addUserMessage,
} from "@/app/redux/features/chatboatSlice";
import { useAppDispatch } from "@/app/redux/redux/hooks";
import { useSelector } from "react-redux";

export function Chat({
  className = "",
  placeholder = "Type your message...",
  welcomeMessage = "Hi! I'm your AI assistant. How can I help you today?",
}: ChatProps) {
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Redux state
  const { messages, chatErrorMessage, isChatError, isChatLoading } =
    useSelector((state: any) => state.chat);

  const dispatch = useAppDispatch();

  // Initialize with welcome message only once
  useEffect(() => {
    if (!hasWelcomeMessage && messages.length === 0) {
      const welcomeMsg = {
        id: "welcome-" + Date.now(),
        content: welcomeMessage,
        sender: "bot",
        timestamp: new Date(),
      };
      // Don't use addUserMessage for welcome message, it should be a bot message
      // You might want to create an addBotMessage action or handle this differently
      setHasWelcomeMessage(true);
    }
  }, [welcomeMessage, messages.length, hasWelcomeMessage, dispatch]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message to Redux store
    dispatch(addUserMessage(content));

    // Send message to API and get bot response
    dispatch(sendChatMessage({ msg: content }));
  };

  // Function to format bot messages for better readability
  const formatBotMessage = (content: string) => {
    if (!content) return content;

    // Split content into lines and process each line
    const lines = content.split("\n");
    let formattedContent = "";
    let inCodeBlock = false;
    let codeLanguage = "";

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Handle code blocks
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeLanguage = line.replace("```", "").trim();
          formattedContent += `\n**${
            codeLanguage.toUpperCase() || "CODE"
          } Code:**\n\n`;
          formattedContent += "```" + codeLanguage + "\n";
        } else {
          // Ending code block
          inCodeBlock = false;
          formattedContent += "\n```\n\n";
        }
        continue;
      }

      // If we're inside a code block, add the line as-is
      if (inCodeBlock) {
        formattedContent += line + "\n";
        continue;
      }

      // Handle headers (lines that end with colon and look like titles)
      if (
        line.trim().endsWith(":") &&
        line.trim().length > 3 &&
        line.trim().length < 100
      ) {
        formattedContent += `\n**${line.trim()}**\n\n`;
        continue;
      }

      // Handle numbered lists (1. 2. 3. etc.)
      if (/^\d+\.\s/.test(line.trim())) {
        formattedContent += `${line.trim()}\n\n`;
        continue;
      }

      // Handle bullet points or dashes
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        formattedContent += `${line.trim()}\n\n`;
        continue;
      }

      // Handle regular paragraphs - add proper spacing
      if (line.trim().length > 0) {
        formattedContent += line.trim() + "\n\n";
      } else {
        formattedContent += "\n";
      }
    }

    // Clean up extra newlines
    formattedContent = formattedContent.replace(/\n{3,}/g, "\n\n").trim();

    return formattedContent;
  };

  // Transform Redux messages to component format
  const transformedMessages = messages.map((msg: any) => {
    // Handle different content formats
    let displayContent;
    let fullResponseData;

    if (msg.sender === "user") {
      // User messages should always have string content
      displayContent = msg.content;
      fullResponseData = undefined;
    } else if (msg.sender === "bot") {
      // Bot messages might have string or object content
      let rawContent;

      if (typeof msg.content === "string") {
        rawContent = msg.content;
        fullResponseData = msg.fullResponse;
      } else if (typeof msg.content === "object" && msg.content.response) {
        rawContent = msg.content.response;
        fullResponseData = msg.content; // The whole object is the full response
      } else if (typeof msg.content === "object") {
        // Handle other possible object structures dynamically
        rawContent =
          msg.content.text ||
          msg.content.message ||
          msg.content.content ||
          JSON.stringify(msg.content);
        fullResponseData = msg.content;
      } else {
        rawContent = "Error: Invalid message format";
        fullResponseData = msg.content;
      }

      // Format the bot message for better readability
      displayContent = formatBotMessage(rawContent);
    }

    return {
      id: msg.id,
      content: displayContent,
      sender: msg.sender,
      timestamp: new Date(msg.timestamp),
      fullResponse: fullResponseData,
    };
  });

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          <p className="text-sm text-gray-500">
            {isChatLoading ? "Typing..." : "Online"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {transformedMessages.map((message: any) => (
          <div key={message.id} className="flex gap-3 mb-4">
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === "user" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  message.sender === "user" ? "text-white" : "text-gray-600"
                }`}
              >
                {message.sender === "user" ? "U" : "AI"}
              </span>
            </div>

            {/* Message Content */}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap">
                {message.content
                  .split("\n")
                  .map((line: string, index: number) => {
                    // Handle code blocks
                    if (line.startsWith("```")) {
                      return null; // Skip the ``` markers as they're handled in the formatting
                    }

                    // Handle bold text
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <div
                          key={index}
                          className="font-semibold text-sm mb-2 mt-2"
                        >
                          {line.replace(/\*\*/g, "")}
                        </div>
                      );
                    }

                    // Handle code content (lines that appear to be code)
                    if (
                      line.trim().length > 0 &&
                      (line.includes("def ") ||
                        line.includes("import ") ||
                        line.includes("print(") ||
                        line.includes("return ") ||
                        line.includes("if ") ||
                        line.includes("class ") ||
                        line.trim().startsWith("#") ||
                        /^\s{4,}/.test(line))
                    ) {
                      return (
                        <code
                          key={index}
                          className="block bg-gray-800 text-green-400 p-2 rounded text-sm font-mono mb-1 overflow-x-auto"
                        >
                          {line}
                        </code>
                      );
                    }

                    // Handle regular text
                    if (line.trim().length > 0) {
                      return (
                        <div key={index} className="mb-2">
                          {line}
                        </div>
                      );
                    }

                    return <br key={index} />;
                  })}
              </div>

              {/* Show metadata for bot messages if available */}
              {message.sender === "bot" && message.fullResponse && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                  {message.fullResponse.agent_used && (
                    <span className="mr-3">
                      Agent: {message.fullResponse.agent_used}
                    </span>
                  )}
                  {message.fullResponse.session_id && (
                    <span>
                      Session: {message.fullResponse.session_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading/Typing indicator */}
        {isChatLoading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">AI</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Error message display */}
        {isChatError && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <div className="bg-red-100 border border-red-300 rounded-2xl rounded-bl-md px-4 py-2">
              <p className="text-red-700 text-sm">
                Error: {chatErrorMessage || "Something went wrong"}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder={placeholder}
          disabled={isChatLoading}
        />
      </div>
    </Card>
  );
}
