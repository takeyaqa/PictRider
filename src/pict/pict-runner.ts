/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { PictParameter, PictOutput } from './pict-types.ts'
// @ts-expect-error - no types available
import createModule from './wasm/pict.mjs'

export class PictRunner {
  private pict: any
  private stdoutCapture: OutputCapture
  private stderrCapture: OutputCapture

  constructor() {
    this.stdoutCapture = new OutputCapture()
    this.stderrCapture = new OutputCapture()
  }

  public async init(): Promise<void> {
    this.pict = await createModule({
      preRun: [
        (module: any) => {
          module.FS.init(
            null,
            this.stdoutCapture.capture,
            this.stderrCapture.capture,
          )
        },
      ],
    })
  }

  public run(parameters: PictParameter[]): PictOutput {
    if (!this.pict) {
      throw new Error('PictRunner not initialized')
    }
    const parametersText = parameters
      .map((m) => `${m.name}: ${m.values}`)
      .join('\n')
    this.pict.FS.writeFile('model.txt', parametersText)
    this.pict.callMain(['model.txt'])
    const err = this.stderrCapture.getOuts()
    if (err) {
      throw new Error(err)
    }
    const out = this.stdoutCapture
      .getOuts()
      .split('\n')
      .map((m) => m.split('\t'))
    this.stdoutCapture.clear()
    return { header: out[0], body: out.slice(1) }
  }
}

class OutputCapture {
  private outs: string[] = []
  public capture = (char: number) => {
    this.outs.push(String.fromCharCode(char))
  }

  public getOuts(): string {
    return this.outs.join('')
  }

  public clear(): void {
    this.outs = []
  }
}
