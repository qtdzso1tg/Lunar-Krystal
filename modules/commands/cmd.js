module.exports.config = {
  name: "cmd",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Mirai Team",
  description: "Quản lý/Kiểm soát toàn bộ module của bot",
  commandCategory: "Hệ Thống",
  usages: "[load/unload/loadAll/unloadAll/info] [tên module]",
  cooldowns: 5,
  dependencies: {
      "fs-extra": "",
      "child_process": "",
      "path": ""
  }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {

  const { execSync } = global.nodemodule['child_process'];
  const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
  const { join } = global.nodemodule['path'];
  const { configPath, mainPath, api } = global.client;
  const logger = require(mainPath + '/utils/log');

  var errorList = [];
  delete require['resolve'][require['resolve'](configPath)];
  var configValue = require(configPath);
  writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
  for (const nameModule of moduleList) {
      try {
          const dirModule = __dirname + '/' + nameModule + '.js';
          delete require['cache'][require['resolve'](dirModule)];
          const command = require(dirModule);
          global.client.commands.delete(nameModule);
          if (!command.config || !command.run || !command.config.commandCategory) 
              throw new Error('𝐌𝐨𝐝𝐮𝐥𝐞 𝐤𝐡𝐨̂𝐧𝐠 𝐝𝐮́𝐧𝐠 𝐝𝐢̣𝐧𝐡 𝐝𝐚̣𝐧𝐠!');
          global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);
          if (command.config.dependencies && typeof command.config.dependencies == 'object') {
              const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                  listbuiltinModules = require('module')['builtinModules'];
              for (const packageName in command.config.dependencies) {
                  var tryLoadCount = 0,
                      loadSuccess = ![],
                      error;
                  const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);
                  try {
                      if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                      else global.nodemodule[packageName] = require(moduleDir);
                  } catch {
                      logger.loader('𝐊𝐡𝐨̂𝐧𝐠 𝐭𝐢̀𝐦 𝐭𝐡𝐚̂́𝐲 𝐏𝐚𝐜𝐤𝐚𝐠𝐞 ' + packageName + ' 𝐡𝐨̂̃ 𝐭𝐫𝐨̛̣ 𝐜𝐡𝐨 𝐥𝐞̣̂𝐧𝐡 ' + command.config.name+ '𝐭𝐢𝐞̂́𝐧 𝐡𝐚̀𝐧𝐡 𝐜𝐚̀𝐢 𝐝𝐚̣̆𝐭...', 'warn');
                      const insPack = {};
                      insPack.stdio = 'inherit';
                      insPack.env = process.env ;
                      insPack.shell = !![];
                      insPack.cwd = join(global.client.mainPath,'nodemodules')
                      execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                      for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                          require['cache'] = {};
                          try {
                              if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);

