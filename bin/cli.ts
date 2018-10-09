import * as program from "commander";

import { bootApi } from "../src/kernel";

program
    .command("server")
    .description("Run the Partner Booking API")
    .action(() => {
        bootApi();
    });

program.command("*").action(context => {
    console.info('Not sure what you wanted to do: "%s"', context);
});

program.parse(process.argv);
