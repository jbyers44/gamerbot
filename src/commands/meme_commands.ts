import { Context } from "../shared/context";
import { play } from "./music_commands";

const victoryRoyale = async (context: Context) => {
    await play(context, "chug jug with you rok nardin remix".split(" "))
}

export {
    victoryRoyale
}