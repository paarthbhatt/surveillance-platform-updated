export class SimulatorStateManager {
  private static instance: SimulatorStateManager
  private activeSimulators: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {}

  static getInstance(): SimulatorStateManager {
    if (!SimulatorStateManager.instance) {
      SimulatorStateManager.instance = new SimulatorStateManager()
    }
    return SimulatorStateManager.instance
  }

  startSimulator(deviceId: string, intervalId: NodeJS.Timeout): void {
    this.activeSimulators.set(deviceId, intervalId)
  }

  stopSimulator(deviceId: string): boolean {
    if (this.activeSimulators.has(deviceId)) {
      const intervalId = this.activeSimulators.get(deviceId)
      if (intervalId) {
        clearInterval(intervalId)
      }
      this.activeSimulators.delete(deviceId)
      return true
    }
    return false
  }

  isRunning(deviceId: string): boolean {
    return this.activeSimulators.has(deviceId)
  }

  getAll(): Map<string, NodeJS.Timeout> {
    return this.activeSimulators
  }
}
