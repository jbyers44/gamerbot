import { play, stop } from '../commands/music_commands';
import { victoryRoyale } from '../commands/meme_commands';
import { Context } from '../shared/context';
import { clear, pause, resume, seek, setVolumeString, shuffle, skip } from '../commands/music_commands';
import { moveAll } from '../commands/admin_commands';

const command_map = new Map<string, (context: Context, args: string[]) => Promise<void>>();

command_map.set('victory royale', victoryRoyale)

command_map.set('play', play)

command_map.set('volume', setVolumeString)

command_map.set('skip', skip)

command_map.set('stop', stop)

command_map.set('seek', seek)

command_map.set('clear', clear)

command_map.set('shuffle', shuffle)

command_map.set('pause', pause)

command_map.set('resume', resume)

command_map.set('move', moveAll)

export {
    command_map
}