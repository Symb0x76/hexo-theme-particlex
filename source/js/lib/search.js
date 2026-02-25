mixins.search = {
    data() {
        return { rawSearch: "" };
    },
    watch: {
        search(value) {
            const timeline = this.$refs.timeline;
            if (!timeline) return;

            const items = timeline.querySelectorAll(".timeline");
            for (const item of items) {
                const keyword = decodeURIComponent(item.dataset.search || "");
                if (!value || keyword.includes(value)) {
                    item.style.opacity = 1;
                    item.style.visibility = "visible";
                    item.style.marginTop = 0;
                } else {
                    item.style.opacity = 0;
                    item.style.visibility = "hidden";
                    item.style.marginTop = -item.offsetHeight - 30 + "px";
                }
            }
        },
    },
    computed: {
        search() {
            return this.rawSearch.toLowerCase().replace(/\s+/g, "");
        },
    },
};
