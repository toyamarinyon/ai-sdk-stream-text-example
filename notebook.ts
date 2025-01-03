// %% hello
import "jsr:@std/dotenv/load";
import { streamText } from "npm:ai@4.0.23";
import { openai } from "npm:@ai-sdk/openai";
const { textStream } = streamText({
  model: openai("gpt-4o"),
  prompt: "hello",
});

for await (const textPart of textStream) {
  console.log(textPart);
}
