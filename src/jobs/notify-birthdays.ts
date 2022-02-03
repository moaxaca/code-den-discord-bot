import { parentPort } from 'worker_threads';

let isCancelled = false;

if (parentPort) {
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });
}

(async () => {
  if (isCancelled) return;

  console.log('test');
  // const channel = this.client.channels.cache.get(message.channelId) as TextChannel;
  // channel.send("Dom we're watching you.");

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
