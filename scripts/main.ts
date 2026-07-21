import { system } from "@minecraft/server";

function mainTick() {
  system.run(mainTick);
}

system.run(mainTick);