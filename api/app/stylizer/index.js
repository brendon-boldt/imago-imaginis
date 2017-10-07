const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

module.exports = {
    test: function(text) {
        return text;
    },
    
    startStyle: async function() {

        const styleCmd = 'th test.lua -content input/content/cornell.jpg -style input/style/woman_with_hat_matisse.jpg -gpu -1 -contentSize 32 -styleSize 32';

        const stylizerPath = '/home/brendon/csca/AdaIN-style/';

        const contentPath = '/tmp/style/cornell.jpg';
        //const contentPath = '/tmp/style/cornell.jpg';
        const contentSize = 32;
        const stylePath = '/tmp/style/woman_in_peasant_dress.jpg';
        //const stylePath = '/tmp/style/woman_with_hat_matisse.jpg';
        const styleSize = 32;
        const gpu = -1;

        const thPath = '/home/brendon/torch/install/bin/th';
        const options = [
            //stylizerPath + 'test.lua',
            'test.lua',
            '-content', `${contentPath}`,
            '-contentSize', contentSize,
            '-style', `${stylePath}`,
            '-styleSize', styleSize,
            '-gpu', gpu
        ];

        execFile(thPath, options, {'cwd': stylizerPath})
            .catch((err) => {
                console.log(err)
            });
        return 'styling started';
    }

}
