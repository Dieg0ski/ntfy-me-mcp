#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import prompts from "prompts";

dotenv.config();

const NTFY_TOPIC = process.env.NTFY_TOPIC;
const NTFY_URL = process.env.NTFY_URL || "https://ntfy.sh";
let NTFY_TOKEN = process.env.NTFY_TOKEN || "";
// Check if topic requires authentication (defaults to false for backward compatibility)
const PROTECTED_TOPIC = process.env.PROTECTED_TOPIC === "true" || false;

async function initializeServer() {
  if (!NTFY_TOPIC) {
    console.error(
      "Error: NTFY_TOPIC environment variable is required. Please ensure it's added to your .env file or passed as an environment variable.",
    );
    process.exit(1);
  }
  
  // Prompt for token if topic is protected and no token is provided
  if (PROTECTED_TOPIC && !NTFY_TOKEN) {
    console.log(`Topic '${NTFY_TOPIC}' is marked as protected and requires authentication.`);
    try {
      const response = await prompts({
        type: 'password',
        name: 'token',
        message: `Enter access token for ${NTFY_URL}/${NTFY_TOPIC}:`,
      }, {
        onCancel: () => {
          console.error('Authentication token is required for protected topics. Exiting.');
          process.exit(1);
        }
      });
      
      NTFY_TOKEN = response.token || "";
      if (!NTFY_TOKEN) {
        console.error('No token provided for protected topic. Exiting.');
        process.exit(1);
      }
      console.log('Token provided. Proceeding with authentication.');
    } catch (error) {
      console.error('Error while prompting for token:', error);
      process.exit(1);
    }
  } else if (!PROTECTED_TOPIC) {
    // For non-protected topics, log that we're assuming it's public
    console.log(`Topic '${NTFY_TOPIC}' is marked as public. No authentication required.`);
  }

  // Create the MCP server
  const server = new McpServer({
    name: "ntfy-me-mcp",
    version: "1.0.0",
  });

  // Add the notify_user tool
  server.tool(
    "ntfy_me",
    "Notify the user that certain task is complete/error/stopped and give the summary and title of the completed task",
    {
      taskTitle: z.string().describe("Current task title/status"),
      taskSummary: z.string().describe("Current task summary"),
      ntfyUrl: z.string().optional().describe("Optional custom ntfy URL (defaults to NTFY_URL env var or https://ntfy.sh)"),
      ntfyTopic: z.string().optional().describe("Optional custom ntfy topic (defaults to NTFY_TOPIC env var)"),
      accessToken: z.string().optional().describe("Optional access token for authentication (defaults to NTFY_TOKEN env var)"),
      priority: z.enum(["min", "low", "default", "high", "max"]).optional().describe("Message priority level"),
      tags: z.array(z.string()).optional().describe("Tags for the notification"),
    },
    async ({ taskTitle, taskSummary, ntfyUrl, ntfyTopic, accessToken, priority, tags }) => {
      try {
        const url = ntfyUrl || NTFY_URL;
        const topic = ntfyTopic || NTFY_TOPIC;
        const token = accessToken || NTFY_TOKEN;
        
        // Create endpoint URL - handle URLs with or without trailing slash
        const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;
        const endpoint = `${baseUrl}/${topic}`;

        // Prepare headers
        const headers: Record<string, string> = { 
          Title: taskTitle
        };
        
        // Add access token if provided
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        // Add priority if specified
        if (priority) {
          headers.Priority = priority;
        }
        
        // Add tags if specified
        // Tags can include emoji shortcodes from https://docs.ntfy.sh/emojis/
        // Examples: "warning" becomes ⚠️, "check" becomes ✅, "red_circle" becomes 🔴, etc.
        if (tags && tags.length > 0) {
          headers.Tags = tags.join(",");
        }
        
        // Remove any newlines from endpoint string (fixing parsing issue)
        const cleanEndpoint = endpoint.trim();
        
        console.log(`Sending notification to ${cleanEndpoint}`);
        
        const response = await fetch(cleanEndpoint, {
          method: "POST",
          body: taskSummary,
          headers
        });

        if (!response.ok) {
          // Check specifically for authentication errors
          if (response.status === 401 || response.status === 403) {
            const serverName = new URL(url).hostname;
            throw new Error(
              `Authentication failed when sending notification to ${serverName}/${topic}. ` +
              `This ntfy topic requires an access token. Please provide a token using the 'accessToken' parameter ` +
              `or set the NTFY_TOKEN environment variable.`
            );
          }
          
          // Handle other errors
          throw new Error(
            `Failed to send ntfy notification. Status code: ${response.status}, Message: ${await response.text()}`
          );
        }

        return {
          content: [
            {
              type: "text",
              text: `Notification sent successfully to ${cleanEndpoint}!`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to send ntfy notification: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // Start the server with stdio transport
  const transport = new StdioServerTransport();
  server
    .connect(transport)
    .then(() => console.log("ntfy-me-mcp running on stdio"))
    .catch((err) => console.error("Failed to start server:", err));
}

// Start the server initialization process
initializeServer().catch(err => {
  console.error("Initialization error:", err);
  process.exit(1);
});
