mixins.highlight = {
	data() {
		return { copying: false };
	},
	created() {
		hljs.configure({ ignoreUnescapedHTML: true });
		this.renderers.push(this.highlight);
	},
	methods: {
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
		highlight() {
			let codes = [...document.querySelectorAll(".content pre")].filter(
				(pre) => {
					if (pre.closest("figure.highlight")) return false;
					if (pre.classList.contains("hljs-ln-code")) return false;
					if (pre.classList.contains("hljs-ln-numbers")) return false;
					if (pre.dataset.particlexHighlighted === "1") return false;
					return true;
				},
			);
			for (let i of codes) {
				let code = i.textContent;
				const firstElement = i.firstElementChild;
				const classes = [
					...i.classList,
					...(firstElement ? [...firstElement.classList] : []),
				];
				const language =
					classes.find((name) => hljs.getLanguage(name)) ||
					"plaintext";
				let highlighted;
				try {
					highlighted = hljs.highlight(code, { language }).value;
				} catch {
					highlighted = code;
				}
				i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
                <div class="language">${language}</div>
                <div class="copycode">
                    <i class="fa-solid fa-copy fa-fw"></i>
                    <i class="fa-solid fa-check fa-fw"></i>
                </div>
                `;
				i.dataset.particlexHighlighted = "1";
				let content = i.querySelector(".code-content");
				hljs.lineNumbersBlock(content, { singleLine: true });
				let copycode = i.querySelector(".copycode");
				copycode.addEventListener("click", async () => {
					if (this.copying) return;
					this.copying = true;
					copycode.classList.add("copied");
					await navigator.clipboard.writeText(code);
					await this.sleep(1000);
					copycode.classList.remove("copied");
					this.copying = false;
				});
			}
		},
	},
};
