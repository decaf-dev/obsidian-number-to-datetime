import { App, Modal, Notice } from "obsidian";
import moment from "moment-timezone";
import "./styles.css";

export default class NumberToDateTimeModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		const modalEl = contentEl.closest(".modal");
		if (modalEl) {
			modalEl.addClass("number-to-datetime-modal");
		}

		const formEl = contentEl.createEl("form");
		formEl.addEventListener("submit", async (event) => {
			event.preventDefault();

			const formData = new FormData(formEl);
			const propertyName = formData.get("property-name");

			if (!propertyName) return;

			try {
				this.close();

				new Notice(
					`Number to DateTime - Converting property: ${propertyName}...`
				);
				const result = await this.convertToDateTime(
					propertyName.toString()
				);
				new Notice(
					`Number To DateTime - Converted property: ${propertyName} in ${result} files`
				);
			} catch (err) {
				new Notice(
					`Number To DateTime  - Failed to convert property: ${propertyName}`
				);
				console.error(err);
			}
		});

		formEl.createEl("input", {
			cls: "number-to-datetime-input",
			attr: {
				name: "property-name",
				type: "text",
				placeholder: "Enter a property name...",
			},
		});
		formEl.createDiv({
			cls: "number-to-datetime-text",
			text: "Press enter to convert",
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private async convertToDateTime(propertyName: string) {
		const { vault } = this.app;
		const files = vault.getMarkdownFiles();

		let numChanged = 0;

		for (const file of files) {
			await this.app.fileManager.processFrontMatter(
				file,
				(frontmatter) => {
					if (
						frontmatter[propertyName] !== undefined &&
						typeof frontmatter[propertyName] === "number"
					) {
						const timestamp = frontmatter[propertyName];
						const dateString = this.utcToDateString(
							timestamp,
							"America/Denver"
						);
						delete frontmatter[propertyName];
						frontmatter[propertyName] = dateString;
						numChanged++;
					}
				}
			);
		}
		await (this.app as any).metadataTypeManager.setType(
			propertyName,
			"datetime"
		);
		return numChanged;
	}

	private utcToDateString(utcTimestamp: number, timezone: string) {
		const utcTime = moment.utc(utcTimestamp);

		const timeInTimeZone = utcTime.tz(timezone);

		const formatted = timeInTimeZone.format("YYYY-MM-DDTHH:mm:ss");
		return formatted;
	}
}
