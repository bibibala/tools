import { useSeoMeta } from "@unhead/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export function useRouteMetaHead() {
  const route = useRoute();

  const title = computed(() =>
    typeof route.meta.title === "string" ? route.meta.title : undefined,
  );
  const description = computed(() =>
    typeof route.meta.description === "string"
      ? route.meta.description
      : undefined,
  );
  const keywords = computed(() =>
    typeof route.meta.keywords === "string" ? route.meta.keywords : undefined,
  );

  useSeoMeta({
    title: title.value,
    description: description.value,
    keywords: keywords.value,
    ogTitle: title.value,
    ogDescription: description.value,
  });
}
