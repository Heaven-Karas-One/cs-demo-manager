import type { Daemon } from 'csdm/common/types/daemon';
import { hasWorkInProgress } from 'csdm/server/idle-monitor/idle-monitor';
import { server } from 'csdm/server/server';
import pkg from '../../../../package.json' with { type: 'json' };
import { APP_USER_MODEL_ID } from 'csdm/common/app-identity';

export async function getDaemonStatusHandler(): Promise<Daemon> {
  return Promise.resolve({
    appId: APP_USER_MODEL_ID,
    version: pkg.version,
    busy: hasWorkInProgress(),
    clientCount: server.getClientCount(),
    isDev: IS_DEV,
  });
}
