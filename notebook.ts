// %% Documents
import { z } from "npm:zod";
const ContentType = z.enum([
  "text/plain",
  "text/markdown",
  "application/pdf",
  "aplication/json",
]);

const DocumentId = z.string().startsWith("dc-");
const Document = z.object({
  id: DocumentId,
  contentType: ContentType,
  content: z.string(),
});
const documents: z.infer<typeof Document>[] = [];

for await (const dirEntry of Deno.readDir("./documents")) {
  Deno.readTextFile(`./documents/${dirEntry.name}`).then((content) => {
    documents.push({
      id: dirEntry.name,
      contentType: "text/markdown",
      content,
    });
  });
}
documents;

// %% Generate Text
import "jsr:@std/dotenv/load";
import { generateText, tool } from "npm:ai@4.0.23";
import { openai } from "npm:@ai-sdk/openai";
const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt:
    "Please summarize the document `dc-2basQ8b.md` and provide a brief explanation.",
  tools: {
    getDocument: tool({
      description: "get the document",
      parameters: z.object({
        documentId: DocumentId,
      }),
      execute: async ({ documentId }) => {
        console.log("execute get document tool");
        const document = documents.find((document) =>
          document.id === documentId
        );
        if (document === undefined) {
          console.warn(`${documentId} is missing in "documents"`);
          return;
        }
        return document;
      },
    }),
  },
  maxSteps: 10,
});

text;
