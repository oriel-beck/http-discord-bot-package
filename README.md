# http-discord-bot-package
WARNING: This package is under construction, please do not use this in production.

This package is a barebones http only bot package.
It uses [find-my-way]() to find commands, components, modal submit and autocomplete interactions and activate their handlers.

## Install
```bash
npm install https://github.com/oriel-beck/http-discord-bot-package @discordjs/builders
```

## Setup
- Set the `main` option in your `package.json` to your main file. If you are using Typescript set it to the output file location.

## Commands
* Currently this package does not support group commands, this will be added later.
To make a command, make a folder called `commands`.
The file name of the command will be used as the command name, so make sure it is correct.

Example:
Path: /commands/ping.ts
```ts
import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandContext, ApplicationCommandController } from "discord-http-bot";

export default class extends ApplicationCommandController {
    handler(
        context: ApplicationCommandContext
    ) {
        context.reply({
            content: "Pong"
        });
    }

    register() {
        return new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong"));
    }
```

## Components
To make a component, make a folder called `components`.
The file name of the component and the folder structure leading to it will be used as the custom Id to locate it, so make sure it is correct. (If the file name is index.ts, the folder name will be used)
You can override the path via the `customId` property.
The path supports [find-my-way]() path structure, you can read about it in their [documentation]().

Example:
Path: /components/applications/[user]/deny.ts
```ts
import { ComponentType } from "discord-api-types/v10";
import { ComponentContext, ComponentInteractionController } from "discord-http-bot";

export default class extends ComponentInteractionController {
    constructor() {
        super({
            componentType: ComponentType.Button
        });
    }

    handler(context: ComponentContext) {
        context.reply({
            content: `Denied the application of <@${context.params['user']}>.`
        });
    }
}
```

## Modals
To make a modal, make a folder called `modals`.
Modal structure is the same as [components](#components) so make sure you read that.

Example:
Path: /modals/answers/[questionnum]/index.ts
```ts
import { ModalSubmitContext, ModalSubmitInteractionController } from "discord-http-bot";

export default class extends ModalSubmitInteractionController {
    handler(context: ModalSubmitContext) {
        context.reply({
            content: `Answered the question ${context.params['questionnum']}`
        });
    }
}
```

## Autocomplete
To make an autocomplete, make a folder called `autocomplete`.
Autocomplete builds the path from the file name and the option provided, so make sure the file name matches the command this autocompletes for.
```ts
import { AutocompleteContext, AutocompleteInteractionController } from "discord-http-bot";

export default class extends AutocompleteInteractionController {
    constructor() {
        super({
            option: "autocomplete"
        });
    }
    
    handler(context: AutocompleteContext) {
        context.autocomplete([
            {
                name: "Test1",
                value: "test1"
            },
            {
                name: "Test2",
                value: "test2"
            },
            {
                name: "Test3",
                value: "test3"
            },
            {
                name: "Test4",
                value: "test4"
            },
            {
                name: "Test5",
                value: "test5"
            }
        ]);
    }
}
```

### Starting the bot
To start the bot, create an index.(js/ts) file and create the HttpBotClient class and login.
```ts
import { HttpOnlyBot } from 'discord-http-bot';

const client = new HttpOnlyBot({
    port: Number(process.env.PORT || 5000),
    botToken: process.env.BOT_TOKEN!,
    publicKey: process.env.APPLICATION_PUBLIC_KEY!
});

client.login();
```