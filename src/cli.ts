import {translate} from './main';
import * as commander from 'commander';

const program = new commander.Command();

program
  .version('0.0.1')
  .name('translate')
  .usage('<english>')
  .arguments('<english>')
  .action(function (english) {
    translate(english);
  });

program.parse(process.argv);
