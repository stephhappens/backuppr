const fs = require('fs-extra');
const tar = require('tar');
const options = process.argv;
const BASE_PATH = options[2];
const PROJECT_PATH = `${BASE_PATH}/test`;

fs.readdir(PROJECT_PATH, (err, items) => {
	items.filter(item => item !== '.DS_Store')
		.map(directory => {
			const TEMP_PATH = `${BASE_PATH}/temp/${directory}`;

			fs.copy(`${PROJECT_PATH}/${directory}`, TEMP_PATH)
				.then(() => {
					const NODE_MODULES = `${TEMP_PATH}/node_modules`;
					const NOW = + new Date();

					fs.pathExists(NODE_MODULES).then((exists) => {
						if (exists) {
							fs.removeSync(NODE_MODULES);
						}

						tar.c({ gzip: true, file: `${BASE_PATH}/${directory}-${NOW}.tgz` }, [TEMP_PATH])
							.then(() => {
								console.log('DONE!');
							}).catch(e => console.error(e));
					});
				}).catch(e => console.log(e));
		});
});
