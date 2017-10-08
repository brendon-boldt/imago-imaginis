const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const config = require('../../config.js');

module.exports = {
    test: function(text) {
        return text;
    },
    
    startStyle: async function(runParams) {
        const options = [
            //stylizerPath + 'test.lua',
            'test.lua',
            '-content', runParams.contentPath,
            '-contentSize', runParams.contentSize,
            '-style', runParams.stylePath,
            '-styleSize', runParams.styleSize,
            '-gpu', config.gpu
        ];

        execFile(config.thPath, options, {'cwd': config.stylizerPath})
            .catch((err) => {
                console.log(err)
            }
		);
        return 'styling started';
    }, 

	runComplete: function(runId, imagePath) {

	}

}
