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
		resolveLanguage(classes) {
			const aliases = {
				cmd: ["dos", "bat", "powershell", "bash"],
				shell: ["bash", "sh", "zsh"],
				shellscript: ["bash", "sh"],
				console: ["bash", "sh", "plaintext"],
				powershell: ["powershell", "ps1", "dos", "bat"],
				ps1: ["powershell", "ps1", "dos", "bat"],
				pwsh: ["powershell", "ps1", "dos", "bat"],
				sh: ["bash", "sh"],
				zsh: ["bash", "sh"],
				js: ["javascript"],
				javascript: ["javascript"],
				mjs: ["javascript"],
				cjs: ["javascript"],
				ts: ["typescript"],
				tsx: ["tsx", "typescript", "javascript"],
				jsx: ["jsx", "javascript"],
				node: ["javascript"],
				yml: ["yaml"],
				md: ["markdown"],
				rb: ["ruby"],
				py: ["python"],
				py3: ["python"],
				"c#": ["csharp", "cs"],
				cs: ["csharp", "cs"],
				"f#": ["fsharp"],
				fs: ["fsharp"],
				"c++": ["cpp", "c"],
				cpp: ["cpp", "c"],
				cc: ["cpp", "c"],
				cxx: ["cpp", "c"],
				hpp: ["cpp", "c"],
				hh: ["cpp", "c"],
				hxx: ["cpp", "c"],
				objc: ["objectivec", "c"],
				"objective-c": ["objectivec", "c"],
				"obj-c": ["objectivec", "c"],
				kt: ["kotlin"],
				kts: ["kotlin"],
				rs: ["rust"],
				golang: ["go"],
				mysql: ["sql"],
				pgsql: ["sql"],
				postgresql: ["sql"],
				psql: ["sql"],
				docker: ["dockerfile"],
				dockerfile: ["dockerfile"],
				vue: ["xml", "html"],
				svelte: ["xml", "html"],
				html: ["xml", "html"],
				htm: ["xml", "html"],
				ini: ["ini", "properties"],
			};
			const displayAliases = {
				cmd: "cmd",
				dos: "cmd",
				bat: "cmd",
				shell: "shell",
				shellscript: "shell",
				bash: "shell",
				sh: "shell",
				zsh: "shell",
				console: "shell",
				powershell: "powershell",
				ps1: "powershell",
				pwsh: "powershell",
				js: "javascript",
				mjs: "javascript",
				cjs: "javascript",
				node: "javascript",
				jsx: "javascript",
				ts: "typescript",
				tsx: "typescript",
				yml: "yaml",
				py: "python",
				py3: "python",
				"c#": "csharp",
				cs: "csharp",
				"f#": "fsharp",
				fs: "fsharp",
				"c++": "cpp",
				cc: "cpp",
				cxx: "cpp",
				hpp: "cpp",
				hh: "cpp",
				hxx: "cpp",
				objc: "objective-c",
				"objective-c": "objective-c",
				"obj-c": "objective-c",
				kt: "kotlin",
				kts: "kotlin",
				rs: "rust",
				golang: "go",
				mysql: "sql",
				pgsql: "sql",
				postgresql: "sql",
				psql: "sql",
				docker: "dockerfile",
				htm: "html",
				vue: "html",
				svelte: "html",
				properties: "ini",
				plaintext: "text",
			};
			const candidates = [];
			for (const className of classes) {
				if (!className) continue;
				candidates.push(className);
				if (className.startsWith("language-")) {
					candidates.push(className.slice("language-".length));
				}
				if (className.startsWith("lang-")) {
					candidates.push(className.slice("lang-".length));
				}
			}
			for (const candidate of candidates) {
				const normalized = candidate.toLowerCase();
				const mapped = aliases[normalized] || [normalized];
				const mappedList = Array.isArray(mapped) ? mapped : [mapped];
				const baseLabel = displayAliases[normalized] || normalized;
				for (const languageName of mappedList) {
					if (hljs.getLanguage(languageName)) {
						return {
							language: languageName,
							label: displayAliases[languageName] || baseLabel,
						};
					}
				}
			}
			return { language: "plaintext", label: "text" };
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
				const { language, label } = this.resolveLanguage(classes);
				let highlighted;
				try {
					highlighted = hljs.highlight(code, { language }).value;
				} catch {
					highlighted = code;
				}
				i.innerHTML = `
                <div class="code-content hljs">${highlighted}</div>
				<div class="language">${label}</div>
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
