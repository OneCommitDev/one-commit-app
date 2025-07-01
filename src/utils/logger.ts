// utils/logger.ts
export function Applog(tag: string, ...messages: any[]) {
  const time = new Date().toISOString();
  console.log(`[${time}] [${tag}]`, ...messages);
}

export function Applogerror(tag: string, ...messages: any[]) {
  const time = new Date().toISOString();
  console.error(`[${time}] [${tag}]`, ...messages);
}
