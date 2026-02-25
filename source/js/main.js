const app = Vue.createApp({
	mixins: Object.values(mixins),
	data() {
		return {
			loading: true,
			hiddenMenu: false,
			showMenuItems: false,
			menuColor: false,
			themeMode: "light",
			scrollTop: 0,
			renderers: [],
		};
	},
	computed: {
		themeToggleIcon() {
			return this.themeMode === "dark" ? "fa-sun" : "fa-moon";
		},
		themeToggleText() {
			return this.themeMode === "dark" ? "浅色" : "深色";
		},
		themeToggleTextLong() {
			return this.themeMode === "dark" ? "浅色模式" : "深色模式";
		},
		themeToggleTitle() {
			return this.themeMode === "dark"
				? "当前：深色模式，点击切换到浅色模式"
				: "当前：浅色模式，点击切换到深色模式";
		},
	},
	created() {
		window.addEventListener("load", () => {
			this.loading = false;
		});
	},
	mounted() {
		this.initThemeMode();
		window.addEventListener("scroll", this.handleScroll, true);
		this.render();
	},
	methods: {
		syncHighlightTheme(themeMode) {
			const lightThemeLink = document.getElementById("hljs-theme-light");
			const darkThemeLink = document.getElementById("hljs-theme-dark");
			if (!lightThemeLink || !darkThemeLink) return;

			if (themeMode === "dark") {
				lightThemeLink.media = "not all";
				darkThemeLink.media = "all";
			} else {
				lightThemeLink.media = "all";
				darkThemeLink.media = "not all";
			}
		},
		initThemeMode() {
			let savedThemeMode = localStorage.getItem("theme-mode");
			const oldThemePreference = localStorage.getItem("theme-preference");

			if (
				!savedThemeMode &&
				(oldThemePreference === "dark" ||
					oldThemePreference === "light")
			) {
				savedThemeMode = oldThemePreference;
			}

			if (savedThemeMode === "dark" || savedThemeMode === "light") {
				this.applyThemeMode(savedThemeMode, false);
			} else {
				const isSystemDark =
					window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: dark)").matches;
				const firstThemeMode = isSystemDark ? "dark" : "light";
				this.applyThemeMode(firstThemeMode);
			}

			localStorage.removeItem("theme-preference");

			const mediaQuery = window.matchMedia
				? window.matchMedia("(prefers-color-scheme: dark)")
				: null;

			if (mediaQuery) {
				if (typeof mediaQuery.addEventListener === "function") {
					mediaQuery.addEventListener("change", () => {
						if (!localStorage.getItem("theme-mode")) {
							this.applyThemeMode(
								mediaQuery.matches ? "dark" : "light",
								false,
							);
						}
					});
				} else if (typeof mediaQuery.addListener === "function") {
					mediaQuery.addListener(() => {
						if (!localStorage.getItem("theme-mode")) {
							this.applyThemeMode(
								mediaQuery.matches ? "dark" : "light",
								false,
							);
						}
					});
				}
			}
		},
		applyThemeMode(themeMode, persist = true) {
			this.themeMode = themeMode;
			document.documentElement.setAttribute("data-theme", themeMode);
			if (typeof this.setHomeBackground === "function") {
				this.setHomeBackground(themeMode);
			}
			this.syncHighlightTheme(themeMode);
			if (persist) {
				localStorage.setItem("theme-mode", themeMode);
			}
		},
		toggleTheme() {
			this.applyThemeMode(this.themeMode === "dark" ? "light" : "dark");
			this.showMenuItems = false;
		},
		render() {
			for (let i of this.renderers) i();
		},
		handleScroll() {
			let wrap = this.$refs.homePostsWrap;
			let newScrollTop = document.documentElement.scrollTop;
			if (this.scrollTop < newScrollTop) {
				this.hiddenMenu = true;
				this.showMenuItems = false;
			} else this.hiddenMenu = false;
			if (wrap) {
				if (newScrollTop <= window.innerHeight - 100)
					this.menuColor = true;
				else this.menuColor = false;
				if (newScrollTop <= 400) {
					wrap.style.top = "-" + newScrollTop / 5 + "px";
				} else {
					wrap.style.top = "-80px";
				}
			}
			this.scrollTop = newScrollTop;
		},
	},
});
app.mount("#layout");
