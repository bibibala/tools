export const USER_NAME = "bibibala";
export const REPO = "tools";
export const REPO_URL = "https://github.com/bibibala/tools";

export async function getRepoInfo() {
    const res = await fetch(
        `https://api.github.com/repos/${USER_NAME}/${REPO}`,
        {
            headers: { Accept: "application/vnd.github.v3+json" },
        },
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    const updatedAt = new Date(data.updated_at);

    return {
        time:
            updatedAt.getFullYear() +
            "-" +
            String(updatedAt.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(updatedAt.getDate()).padStart(2, "0") +
            " " +
            String(updatedAt.getHours()).padStart(2, "0") +
            ":" +
            String(updatedAt.getMinutes()).padStart(2, "0") +
            ":" +
            String(updatedAt.getSeconds()).padStart(2, "0"),
        stars: data.stargazers_count,
    };
}
