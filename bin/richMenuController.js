const fs = require('fs');
const line = require('@line/bot-sdk');
const { lineConf } = require('../config');

const client = new line.Client({
    channelAccessToken: lineConf.LINE_CHANNEL_ACCESS_TOKEN
})

function usage() {
    console.log(`Usage: $ node ${process.argv[1]} method [option]`);
    console.log('method:');
    console.log("\tcreate [menuObjFile.json] [menuImageFile.png]: default 'testmenu.json testmenu.png'.");
    console.log("\tapply richMenuId: richMenuId is required.");
    console.log("\tdelete richMenuId: richMenuId is required.");
    console.log("\tlist [option]: 'all'(all data) or 'menuId'(menuId and name). default 'menuId'.");
}

async function createMenu(jsonFile, imageFile) {
    try {
        const richMenu = JSON.parse(fs.readFileSync(jsonFile));
        const richMenuId = await client.createRichMenu(richMenu);
        await client.setRichMenuImage(richMenuId, fs.createReadStream(imageFile));
        console.log('create success: ', richMenuId);
    } catch (err) {
        console.log(err);
    };
}

async function applyMenuDefault(richMenuId) {
    try {
        await client.setDefaultRichMenu(richMenuId);
        console.log('apply success: ', richMenuId);
    } catch (err) {
        console.log(err);
    }
}

async function deleteMenu(richMenuId) {
    try {
        await client.deleteRichMenu(richMenuId);
        console.log('delete success: '. richMenuId);
    } catch (err) {
        console.log(err);
    }
}

async function listMenues(outputFormat) {
    try {
        const richMenues = await client.getRichMenuList();
        if (outputFormat === 'all') {
            console.log(richMenues);
        } else if (outputFormat === 'menuId') {
            const trimmedMenues = richMenues.map(menu => {
                return {
                    richMenuId: menu.richMenuId,
                    name: menu.name
                };
            });
            console.log(trimmedMenues);
        }
        console.log('menu count: ', richMenues.length);
    } catch (err) {
        console.log(err);
    }
}

if (process.argv.length < 3) {
    usage();
    return
}

switch (process.argv[2]) {
    case 'create':
        const menuObjFile = process.argv[3] || 'testmenu.json';
        const menuImageFile = process.argv[3] || 'testmenu.png';
        
        createMenu(menuObjFile, menuImageFile);
        break;
    case 'apply':
        if (process.argv[3] === undefined) {
            usage();
            return;
        }
        applyMenuDefault(process.argv[3]);
        break;
    case 'delete':
        if (process.argv[3] === undefined) {
            usage();
            return;
        }
        deleteMenu(process.argv[3]);
        break;
    case 'list':
        switch (process.argv[3]) {
            case undefined:
            case 'menuId':
                listMenues('menuId');
                break;
            case 'all':
                listMenues('all');
                break;
            default:
                usage();
        }
        break;
    default:
        usage();
}
