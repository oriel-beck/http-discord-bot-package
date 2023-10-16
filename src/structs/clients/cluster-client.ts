import { Client, type ClientOptions } from './client';
import cluster from 'cluster';
import os from 'os';
import pino, { Logger } from 'pino';

export class ClusterClient {
  logger: Logger;
  constructor(public opts: ClusterClientOptions) {
    this.logger = pino({
      level: 'debug',
      name: 'discord-http-bot',
      ...opts?.loggerOptions,
    });
  }
  /**
   * You can override this to use less cores, making this use more will result in the cluster crushing
   */
  cpuCount = os.cpus().length;

  async login(token: string) {
    if (!token || typeof token !== 'string') throw new Error('Please provide a valid bot token');
    if (cluster.isPrimary) return this.primaryProcess();
    else return await this.workerProcess(token);
  }

  private primaryProcess() {
    this.logger.debug(`Master ${process.pid} is running`);

    for (let i = 0; i < this.cpuCount; i++) {
      this.logger.debug(`Forking process number ${i}`);
      cluster.fork();
    }
    return 'master';
  }

  private async workerProcess(token: string) {
    const client = new Client({
      port: this.opts.port,
      publicKey: process.env.APPLICATION_PUBLIC_KEY!,
    });

    return await client.login(token);
  }
}

export interface ClusterClientOptions extends ClientOptions {
  /**
   * You can override this to use less cores, making this use more will result in the cluster crushing
   */
  cpuCount?: number;
}
