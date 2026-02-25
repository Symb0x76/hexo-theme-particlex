/**
 * TOC (Table of Contents) Generator
 * Generates a table of contents from h1-h6 headers in the page
 */

const tocMixin = {
	data() {
		return {
			tocExpanded: true,
		};
	},
	methods: {
		generateTableOfContents() {
			// Only run on post pages
			const content = document.querySelector(".article .content");
			const tocNav = document.getElementById("toc");
			const tocToggle = document.getElementById("toc-toggle");
			const tocContainer = document.getElementById("toc-container");

			if (!content || !tocNav) return;

			// Get all headings
			const headings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");

			// If no headings or only one, hide toc
			if (headings.length <= 1) {
				if (tocContainer) {
					tocContainer.style.display = "none";
				}
				return;
			}

			// Generate slugs and add IDs to headings
			const toc = [];
			const headingMap = new Map();

			headings.forEach((heading, index) => {
				// Skip h1 as it's the title
				if (heading.tagName === "H1") return;

				let slug = heading.textContent
					.toLowerCase()
					.trim()
					.replace(/[^\w\s-]/g, "")
					.replace(/\s+/g, "-")
					.replace(/-+/g, "-");

				// Avoid duplicate slugs
				if (headingMap.has(slug)) {
					const count = headingMap.get(slug);
					headingMap.set(slug, count + 1);
					slug = `${slug}-${count + 1}`;
				} else {
					headingMap.set(slug, 1);
				}

				// Set the ID on the heading if it doesn't have one
				if (!heading.id) {
					heading.id = slug;
				}

				toc.push({
					level: parseInt(heading.tagName[1]),
					text: heading.textContent,
					id: heading.id,
				});
			});

			// Render TOC
			const tocHtml = renderTocTree(toc);
			tocNav.innerHTML = tocHtml;

			// Add click handlers to TOC links
			tocNav.querySelectorAll("a").forEach((link) => {
				link.addEventListener("click", (e) => {
					e.preventDefault();
					const targetId = link.getAttribute("href").substring(1);
					const targetElement = document.getElementById(targetId);
					if (targetElement) {
						targetElement.scrollIntoView({ behavior: "smooth" });
						// Update active state
						tocNav
							.querySelectorAll("a")
							.forEach((l) => l.classList.remove("active"));
						link.classList.add("active");
					}
				});
			});

			// Highlight active toc item on scroll
			window.addEventListener("scroll", () => {
				let currentId = null;
				const headingElements = document.querySelectorAll(
					".article .content h2, .article .content h3, .article .content h4, .article .content h5, .article .content h6",
				);

				headingElements.forEach((heading) => {
					const rect = heading.getBoundingClientRect();
					if (rect.top <= 150) {
						currentId = heading.id;
					}
				});

				tocNav.querySelectorAll("a").forEach((link) => {
					link.classList.remove("active");
					if (
						currentId &&
						link.getAttribute("href").substring(1) === currentId
					) {
						link.classList.add("active");
					}
				});
			});

			// Toggle TOC
			if (tocToggle) {
				tocToggle.addEventListener("click", () => {
					this.tocExpanded = !this.tocExpanded;
					tocNav.style.maxHeight = this.tocExpanded ? "1000px" : "0";
					tocToggle.querySelector("i").className = this.tocExpanded
						? "fa-solid fa-chevron-up"
						: "fa-solid fa-chevron-down";
				});
			}
		},
	},
	watch: {
		loading(newVal) {
			if (!newVal) {
				// Generate TOC after page is loaded
				this.$nextTick(() => {
					setTimeout(() => {
						this.generateTableOfContents();
					}, 100);
				});
			}
		},
	},
};

function renderTocTree(toc) {
	if (toc.length === 0) return "";

	let html = "<ul>";
	let currentLevel = toc[0].level;

	toc.forEach((item, index) => {
		if (item.level > currentLevel) {
			// Open nested list
			for (let i = currentLevel; i < item.level; i++) {
				html += "<ul>";
			}
			currentLevel = item.level;
		} else if (item.level < currentLevel) {
			// Close nested lists
			for (let i = item.level; i < currentLevel; i++) {
				html += "</ul>";
			}
			currentLevel = item.level;
		}

		html += `<li><a href="#${item.id}">${item.text}</a></li>`;
	});

	// Close all remaining open lists
	for (let i = 2; i <= currentLevel; i++) {
		html += "</ul>";
	}
	html += "</ul>";

	return html;
}

// Register mixin
if (typeof mixins !== "undefined") {
	mixins.toc = tocMixin;
}
