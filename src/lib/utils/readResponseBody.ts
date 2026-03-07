/**
 * Reads a response body as text, up to a maximum byte limit.
 * If the response exceeds the limit, returns the content read so far.
 * This is safe because consumers (HTML parsing, feed title extraction)
 * work correctly on partial/truncated content.
 *
 * @param response - The fetch Response to read.
 * @param maxBytes - Maximum number of bytes to read.
 * @returns The response body text, potentially truncated.
 */
export async function readResponseBody(
  response: Response,
  maxBytes: number,
): Promise<string> {
  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        // Keep only the portion that fits within the limit
        const excess = totalBytes - maxBytes;
        chunks.push(value.slice(0, value.byteLength - excess));
        break;
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const decoder = new TextDecoder();
  return chunks
    .map((chunk) => decoder.decode(chunk, { stream: true }))
    .join("");
}
