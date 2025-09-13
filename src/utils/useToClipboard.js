import useToast from "@/utils/useToast.js";

/**
 *
 * @param code
 * @return {Promise<void>}
 */
export const copyToClipboard = async (code) => {
    try {
        await navigator.clipboard.writeText(code);
        useToast.showSuccess("复制成功");
    } catch (err) {
        console.error("复制失败:", err);
        useToast.showError("复制失败，请手动复制");
    }
};
