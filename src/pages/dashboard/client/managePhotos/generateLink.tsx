import type { Video } from "../types";

/**
 * Generates a shareable link for a video
 * Format: /share/video/{videoId}?token={accessToken}
 */
export function generateShareableLink(
  video: Video,
  accessToken: string,
): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/video/${video.id}?token=${encodeURIComponent(accessToken)}`;
}

/**
 * Copies the generated link to clipboard and shows a toast notification
 */
export async function copyLinkToClipboard(
  video: Video,
  accessToken: string,
  showToast: (message: string, type?: "success" | "error") => void,
): Promise<boolean> {
  try {
    const link = generateShareableLink(video, accessToken);
    await navigator.clipboard.writeText(link);
    showToast("Link copied to clipboard!", "success");
    return true;
  } catch (error) {
    console.error("Failed to copy link:", error);
    showToast("Failed to copy link. Please try again.", "error");
    return false;
  }
}

/**
 * Simple toast function that can be used if no external toast library is available
 */
export function showSimpleToast(
  message: string,
  type: "success" | "error" = "success",
): void {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
    type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`;
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("animate-out", "fade-out", "slide-out-to-bottom-2");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}
