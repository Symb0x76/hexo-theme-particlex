mixins.home = {
    mounted() {
        this.setHomeBackground(this.themeMode);
        this.menuColor = true;
    },
    methods: {
        setHomeBackground(themeMode = "light") {
            const background = this.$refs.homeBackground;
            if (!background) return;

            const lightImage = background.dataset.bgLight || "";
            const darkImage = background.dataset.bgDark || "";
            const imageByTheme = themeMode === "dark" ? darkImage : lightImage;

            if (imageByTheme) {
                background.style.backgroundImage = `url('${imageByTheme}')`;
                return;
            }

            const images = (background.dataset.images || "")
                .split(",")
                .map((url) => url.trim())
                .filter(Boolean);
            if (images.length === 0) return;

            const id = Math.floor(Math.random() * images.length);
            background.style.backgroundImage = `url('${images[id]}')`;
        },
        homeClick() {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        },
    },
};
