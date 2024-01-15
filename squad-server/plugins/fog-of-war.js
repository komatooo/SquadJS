import BasePlugin from './base-plugin.js';

export default class FogOfWar extends BasePlugin {
  static get description() {
    return 'The <code>FogOfWar</code> plugin can be used to automate setting fog of war mode.';
  }

  static get defaultEnabled() {
    return false;
  }

  static get optionsSpecification() {
    return {
      mode: {
        required: false,
        description: 'Fog of war mode to set.',
        default: 1
      },
      allowedForGameModes: {
        required: false,
        description: 'Allowed game modes for enabling fog of war',
        default: ['AAS', 'RAAS', 'Invasion', 'Insurgency', 'Skirmish']
      },
      delay: {
        required: false,
        description: 'Delay before setting fog of war mode.',
        default: 10 * 1000
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.onNewGame = this.onNewGame.bind(this);
  }

  async mount() {
    this.server.on('NEW_GAME', this.onNewGame);
  }

  async unmount() {
    this.server.removeEventListener('NEW_GAME', this.onNewGame);
  }

  async onNewGame() {
    setTimeout(async () => {
      let isFogEnabled = this.options.mode;
      if (isFogEnabled === 1 && this.options.allowedForGameModes.length > 0) {
        const currentMap = await this.server.rcon.getCurrentMap();
        isFogEnabled = this.options.allowedForGameModes.some((gameMode) =>
          currentMap.layer.includes(gameMode)
        )
          ? 1
          : 0;
      }

      await this.server.rcon.setFogOfWar(isFogEnabled);
    }, this.options.delay);
  }
}
