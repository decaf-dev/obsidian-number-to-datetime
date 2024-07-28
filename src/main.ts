import { Plugin } from "obsidian";
import NumberToDateTimeModal from "./obsidian/number-to-datetime-modal";

interface NumberToDateTimeSettings {}

const DEFAULT_SETTINGS: NumberToDateTimeSettings = {};

export default class NumberToDateTimePlugin extends Plugin {
	settings: NumberToDateTimeSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "number-to-datetime",
			name: "Convert number property to datetime property",
			callback: () => {
				new NumberToDateTimeModal(this.app).open();
			},
		});

		// // This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
