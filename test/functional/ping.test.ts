import { DiscordTestingHarness } from "../util/harness";

describe("Ping Functional Test", () => {
  let harness!: DiscordTestingHarness;

  beforeEach(async () => {
    harness = new DiscordTestingHarness();
    const modulesToTest = [harness.moduleFactory.createPing()];
    await harness.createUniverse(modulesToTest);
  })

  afterEach(async () => {
    await harness.destroyUniverse();
  });

  it("Should Reply Pong", (done) => {
    harness.sendTestMessage("/ping");
  });
});
