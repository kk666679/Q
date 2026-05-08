type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogMeta = Record<string, unknown>;

const sanitize = (v: unknown): string =>
  String(v).replace(/[\r\n\t]/g, ' ').slice(0, 500);

const sanitizeMeta = (meta?: LogMeta): LogMeta =>
  meta
    ? Object.fromEntries(Object.entries(meta).map(([k, v]) => [k, sanitize(v)]))
    : {};

function log(level: LogLevel, msg: string, meta?: LogMeta): void {
  const entry = JSON.stringify({
    level,
    msg: sanitize(msg),
    ts: new Date().toISOString(),
    ...sanitizeMeta(meta),
  });
  if (level === 'error') {
    console.error(entry);
  } else if (level === 'warn') {
    console.warn(entry);
  } else {
    console.log(entry);
  }
}

export const logger = {
  info:  (msg: string, meta?: LogMeta) => log('info',  msg, meta),
  warn:  (msg: string, meta?: LogMeta) => log('warn',  msg, meta),
  error: (msg: string, meta?: LogMeta) => log('error', msg, meta),
  debug: (msg: string, meta?: LogMeta) => log('debug', msg, meta),
};
