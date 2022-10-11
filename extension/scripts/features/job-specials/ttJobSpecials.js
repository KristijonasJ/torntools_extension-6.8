"use strict";

(async () => {
	if (!getPageStatus().access) return;

	const feature = featureManager.registerFeature(
		"Job Specials",
		"joblist",
		() => settings.pages.joblist.specials,
		addListener,
		showSpecials,
		removeSpecials,
		{
			storage: ["settings.pages.joblist.specials"],
		},
		async () => {
			await checkDevice();
		}
	);

	async function addListener() {
		CUSTOM_LISTENERS[EVENT_CHANNELS.COMPANY_EMPLOYEES_PAGE].push(() => {
			if (!feature.enabled) return;

			showSpecials();
		});
	}

	async function showSpecials() {
		if (findContainer("Job Specials")) return;
		await requireElement(".content-wrapper .company-details");

		const { content } = createContainer("Job Specials", {
			previousElement: document.find(".company-details-wrap"),
			spacer: true,
		});

		const companyType = document.find(".details-wrap ul.info .m-title .m-show:not(.arrow-left)").textContent.trim();
		const companyInfo = COMPANY_INFORMATION[companyType];

		for (const stars of [1, 3, 5, 7, 10]) {
			const { name, cost, effect } = companyInfo[stars];

			if (!mobile) {
				content.appendChild(
					document.newElement({
						type: "div",
						class: "tt-company-info-wrap",
						children: [
							document.newElement({ type: "div", class: "heading", text: `${name} (${stars}★)` }),
							document.newElement({ type: "hr", class: "first-hr" }),
							document.newElement({ type: "div", text: `${cost} ${cost === "Passive" ? "" : cost === "1" ? "job point" : "job points"}` }),
							document.newElement({ type: "hr", class: "second-hr" }),
							document.newElement({ type: "div", text: effect }),
						],
					})
				);
			} else {
				content.appendChild(
					document.newElement({
						type: "tr",
						class: "tt-company-info-wrap",
						children: [
							document.newElement({
								type: "div",
								class: "heading",
								children: [document.newElement({ type: "div", text: name }), document.newElement({ type: "div", text: `(${stars}★)` })],
							}),
							document.newElement({ type: "div", text: `${cost} ${cost === "Passive" ? "" : cost === "1" ? "job point" : "job points"}` }),
							document.newElement({ type: "div", text: effect }),
						],
					})
				);
			}
		}
	}

	function removeSpecials() {
		removeContainer("Job Specials");
	}
})();
