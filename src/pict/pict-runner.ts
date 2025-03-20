/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { PictParameter, PictConstraint, PictOutput } from './pict-types'
import { convertConstraint } from './pict-helper'
// @ts-expect-error - no types available
import createModule from './wasm/pict'

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
      print: this.stdoutCapture.capture,
      printErr: this.stderrCapture.capture,
    })
  }

  public run(
    parameters: PictParameter[],
    constraints: PictConstraint[],
  ): PictOutput {
    if (!this.pict) {
      throw new Error('PictRunner not initialized')
    }
    const parametersText = parameters
      .map((m) => `${m.name}: ${m.values}`)
      .join('\n')
    const constraintsText = constraints
      .map((c) => convertConstraint(c))
      .join('\n')
    this.pict.FS.writeFile(
      'model.txt',
      `${parametersText}\n\n${constraintsText}`,
    )
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
  public capture = (line: string) => {
    this.outs.push(line)
  }

  public getOuts(): string {
    const out = this.outs.join('\n')
    this.clear()
    return out
  }

  public clear(): void {
    this.outs = []
  }
}
