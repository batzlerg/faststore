export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export class NewrelicClient {
  private baseUrl = 'https://log-api.newrelic.com/log/v1'
  private serviceName = 'faststore'
  private storeId
  private newRelicApiKey

  constructor(storeId: string, newRelicApiKey?: string) {
    //TODO: set the marketing api key from the env variable
    this.storeId = storeId
    this.newRelicApiKey = newRelicApiKey
  }

  private sendLog = async (
    message: any,
    logLevel: LogLevel,
    payload?: object
  ) => {
    if (process.env.NODE_ENV === 'development') {
      return console.log({
        message: JSON.stringify(message),
        payload: JSON.stringify(payload),
      })
    }

    if (!this.newRelicApiKey) {
      console.error('Newrelic on the serverside is not configured api')
      return
    }
    const headers = new Headers()
    headers.append('Api-Key', this.newRelicApiKey)
    headers.append('Content-Type', 'application/json')

    try {
      await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          timestamp: Date.now(),
          logtype: 'custom',
          message: {
            service_name: this.serviceName,
            level: logLevel,
            message: JSON.stringify(message),
            payload: JSON.stringify(payload),
            vtexAccount: this.storeId,
            vtexWorkspace: this.storeId,
          },
        }),
      })
    } catch (err) {
      console.error('Error Sending newrelic logs: ', err)
    }
  }

  debug = (message: any) => this.sendLog(message, LogLevel.Debug)
  info = (message: any, payload?: object) => this.sendLog(message, LogLevel.Info, payload)
  warn = (message: any) => this.sendLog(message, LogLevel.Warn)
  error = (message: any, payload?: object) => this.sendLog(message, LogLevel.Error, payload)
  log = (message: any, level: LogLevel) => this.sendLog(message, level)
}

export default NewrelicClient
