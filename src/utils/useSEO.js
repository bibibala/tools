export function useSEO() {
    const setPageMeta = (meta = {}) => {
        // 只在浏览器环境中执行
        if (typeof window === "undefined" || typeof document === "undefined") {
            return;
        }

        const {
            title = "MyTools",
            description = "MyTools - 实用在线工具集合",
            keywords = "MyTools, 工具, 在线工具",
            ogImage = "/og-image.png",
        } = meta;

        // 设置页面标题
        document.title = title.includes("MyTools")
            ? title
            : `${title} · MyTools`;

        // 设置或更新meta标签
        setMetaTag("description", description);
        setMetaTag("keywords", keywords);
        setMetaTag("og:title", title, "property");
        setMetaTag("og:description", description, "property");
        setMetaTag("og:image", ogImage, "property");
        setMetaTag("twitter:title", title);
        setMetaTag("twitter:description", description);
        setMetaTag("twitter:image", ogImage);
    };

    const setMetaTag = (name, content, attribute = "name") => {
        if (typeof document === "undefined") return;

        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        meta.setAttribute("content", content);
    };

    return { setPageMeta };
}
