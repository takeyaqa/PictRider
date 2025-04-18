/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
import { Parameter, Constraint, Output, Options } from './pict-types'
import { printConstraints } from './pict-helper'
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
    parameters: Parameter[],
    {
      constraints,
      options,
    }: {
      constraints?: Constraint[]
      options?: Options
    },
  ): Output {
    if (!this.pict) {
      throw new Error('PictRunner not initialized')
    }
    // Build the model
    const parametersText = parameters
      .map((m) => `${m.name}: ${m.values}`)
      .join('\n')
    const constraintsText = printConstraints(
      constraints ?? [],
      parameters.map((m) => m.name),
    )
    const model = constraintsText
      ? `${parametersText}\n\n${constraintsText}`
      : parametersText
    this.pict.FS.writeFile('model.txt', model)

    // Set the options
    const switches: string[] = []
    if (options) {
      if (options.orderOfCombinations) {
        switches.push(`/o:${options.orderOfCombinations.toString()}`)
      }
    }
    this.pict.callMain(['model.txt', ...switches])
    this.pict.FS.unlink('model.txt')
    const err = this.stderrCapture.getOuts()
    if (err) {
      throw new Error(err)
    }
    const out = this.stdoutCapture
      .getOuts()
      .split('\n')
      .map((m) => m.split('\t'))
    this.stdoutCapture.clear()
    return { header: out[0], body: out.slice(1), modelFile: model }
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
