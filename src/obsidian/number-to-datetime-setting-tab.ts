import { App, PluginSettingTab } from "obsidian";
import NumberToDateTimePlugin from "src/main";

export class NumberToDateTimeSettingTab extends PluginSettingTab {
	plugin: NumberToDateTimePlugin;

	constructor(app: App, plugin: NumberToDateTimePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
	}
}
