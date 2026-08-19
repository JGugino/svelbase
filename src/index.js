import { defineAddon, defineAddonOptions } from 'sv';
import { transforms } from './sv-utils.js';

const options = defineAddonOptions()
	.add('pocketbase', {
		question: 'Docker or Local binary?',
		type: 'select',
    default: "docker",
    options: [
      {label: "Docker", value: "docker", hint: "Use a docker-compose for pb"},
      {label: "Local", value: "local", hint: "Download pocketbase binary"}
		]
	})
	.build();

export default defineAddon({
	id: '@svelbase/svelbase',
	options,

	setup: ({ isKit, unsupported }) => {
		if (!isKit) unsupported('Requires SvelteKit');
	},

	run: ({ directory, sv, options, language }) => {

	}
});
