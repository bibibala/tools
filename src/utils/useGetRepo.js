const username = "bibibala";
const repo = "tools";

export async function getRepoUpdateTime() {
    const res = await fetch(
        `https://api.github.com/repos/${username}/${repo}`,
        {
            headers: { Accept: "application/vnd.github.v3+json" },
        },
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();

    const updatedAt = new Date(data.updated_at);

    return (
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
        String(updatedAt.getSeconds()).padStart(2, "0")
    );
}
